#!/usr/bin/env python3

"""
Train a Custom DeFi Trading Model
Fine-tunes blockchain models on real trading data
"""

import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from transformers import (
    AutoModelForSequenceClassification,
    AutoTokenizer,
    Trainer,
    TrainingArguments,
    AutoModelForCausalLM
)
import pandas as pd
import numpy as np
import json
import requests
from datetime import datetime, timedelta
import asyncio
import aiohttp
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import warnings
warnings.filterwarnings('ignore')

class DeFiDataCollector:
    """Collect and prepare DeFi data for training"""

    def __init__(self):
        self.apis = {
            'defillama': 'https://api.llama.fi',
            'coingecko': 'https://api.coingecko.com/api/v3',
            'dune': 'https://api.dune.com/api/v1'
        }

    async def collect_training_data(self, days=30):
        """Collect historical DeFi data for training"""

        print("📊 Collecting DeFi training data...")

        data = {
            'protocols': [],
            'pools': [],
            'tokens': [],
            'transactions': []
        }

        async with aiohttp.ClientSession() as session:
            # Collect protocol TVL history
            print("   Fetching protocol TVL data...")
            async with session.get(f"{self.apis['defillama']}/protocols") as resp:
                protocols = await resp.json()
                data['protocols'] = protocols[:100]  # Top 100 protocols

            # Collect yield pools data
            print("   Fetching yield pools data...")
            async with session.get(f"{self.apis['defillama']}/pools") as resp:
                pools = await resp.json()
                data['pools'] = pools['data'][:200]  # Top 200 pools

            # Collect token price history
            print("   Fetching token price history...")
            top_tokens = ['bitcoin', 'ethereum', 'binancecoin', 'solana', 'chainlink']
            for token in top_tokens:
                url = f"{self.apis['coingecko']}/coins/{token}/market_chart"
                params = {'vs_currency': 'usd', 'days': days}
                async with session.get(url, params=params) as resp:
                    token_data = await resp.json()
                    data['tokens'].append({
                        'token': token,
                        'prices': token_data.get('prices', []),
                        'volumes': token_data.get('total_volumes', []),
                        'market_caps': token_data.get('market_caps', [])
                    })

        print(f"✅ Collected data for {len(data['protocols'])} protocols, {len(data['pools'])} pools")
        return data

    def prepare_training_dataset(self, raw_data):
        """Prepare data for model training"""

        print("\n🔧 Preparing training dataset...")

        training_samples = []

        # Create samples from price movements
        for token_data in raw_data['tokens']:
            prices = token_data['prices']
            volumes = token_data['volumes']

            for i in range(len(prices) - 1):
                # Calculate features
                price_change = (prices[i+1][1] - prices[i][1]) / prices[i][1]
                volume_change = (volumes[i+1][1] - volumes[i][1]) / volumes[i][1] if volumes[i][1] > 0 else 0

                # Create label (BUY, SELL, HOLD)
                if price_change > 0.02:
                    label = 2  # BUY
                elif price_change < -0.02:
                    label = 0  # SELL
                else:
                    label = 1  # HOLD

                # Create text representation for language model
                text = f"""
                Token: {token_data['token']}
                Current Price: ${prices[i][1]:.2f}
                Volume: ${volumes[i][1]:,.0f}
                Price Change 1h: {price_change*100:.2f}%
                Volume Change 1h: {volume_change*100:.2f}%
                """

                training_samples.append({
                    'text': text.strip(),
                    'label': label,
                    'features': {
                        'price': prices[i][1],
                        'volume': volumes[i][1],
                        'price_change': price_change,
                        'volume_change': volume_change
                    }
                })

        # Add DeFi protocol data
        for protocol in raw_data['protocols'][:50]:
            if 'tvl' in protocol and protocol['tvl']:
                text = f"""
                Protocol: {protocol.get('name', 'Unknown')}
                TVL: ${protocol.get('tvl', 0):,.0f}
                Chain: {protocol.get('chain', 'Unknown')}
                Category: {protocol.get('category', 'Unknown')}
                Change 1d: {protocol.get('change_1d', 0):.2f}%
                """

                # Simple labeling based on TVL change
                change = protocol.get('change_1d', 0)
                if change > 5:
                    label = 2  # BUY
                elif change < -5:
                    label = 0  # SELL
                else:
                    label = 1  # HOLD

                training_samples.append({
                    'text': text.strip(),
                    'label': label,
                    'features': {
                        'tvl': protocol.get('tvl', 0),
                        'change_1d': change
                    }
                })

        print(f"✅ Prepared {len(training_samples)} training samples")
        return training_samples

class DeFiTradingDataset(Dataset):
    """PyTorch dataset for DeFi trading data"""

    def __init__(self, samples, tokenizer, max_length=256):
        self.samples = samples
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        sample = self.samples[idx]

        # Tokenize text
        encoding = self.tokenizer(
            sample['text'],
            truncation=True,
            padding='max_length',
            max_length=self.max_length,
            return_tensors='pt'
        )

        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': torch.tensor(sample['label'], dtype=torch.long)
        }

class DeFiModelTrainer:
    """Train custom DeFi trading models"""

    def __init__(self, base_model='ElKulako/cryptobert'):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print(f"\n🚀 Initializing trainer on {self.device}")

        # Load base model and tokenizer
        print(f"📦 Loading base model: {base_model}")
        self.model = AutoModelForSequenceClassification.from_pretrained(
            base_model,
            num_labels=3,  # BUY, HOLD, SELL
            ignore_mismatched_sizes=True
        ).to(self.device)

        self.tokenizer = AutoTokenizer.from_pretrained(base_model)

        # Add padding token if needed
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token
            self.model.config.pad_token_id = self.tokenizer.pad_token_id

        print("✅ Model and tokenizer loaded")

    def train(self, training_samples, epochs=3, batch_size=16):
        """Fine-tune the model on DeFi data"""

        print(f"\n🎯 Starting training:")
        print(f"   Samples: {len(training_samples)}")
        print(f"   Epochs: {epochs}")
        print(f"   Batch size: {batch_size}")

        # Split data
        train_samples, val_samples = train_test_split(
            training_samples,
            test_size=0.2,
            random_state=42
        )

        # Create datasets
        train_dataset = DeFiTradingDataset(train_samples, self.tokenizer)
        val_dataset = DeFiTradingDataset(val_samples, self.tokenizer)

        # Training arguments optimized for RTX 4080
        training_args = TrainingArguments(
            output_dir='./defi-trading-model',
            num_train_epochs=epochs,
            per_device_train_batch_size=batch_size,
            per_device_eval_batch_size=batch_size*2,
            gradient_accumulation_steps=2,
            warmup_steps=100,
            weight_decay=0.01,
            logging_dir='./logs',
            logging_steps=10,
            evaluation_strategy="epoch",
            save_strategy="epoch",
            load_best_model_at_end=True,
            metric_for_best_model="eval_loss",
            fp16=True,  # Use mixed precision
            gradient_checkpointing=True,  # Save memory
            optim="adamw_torch",
            learning_rate=2e-5,
        )

        # Create trainer
        trainer = Trainer(
            model=self.model,
            args=training_args,
            train_dataset=train_dataset,
            eval_dataset=val_dataset,
            tokenizer=self.tokenizer,
        )

        # Train
        print("\n🔄 Training model...")
        trainer.train()

        # Save model
        print("\n💾 Saving fine-tuned model...")
        trainer.save_model('./defi-trading-model-final')
        self.tokenizer.save_pretrained('./defi-trading-model-final')

        print("✅ Training complete!")

        return trainer

    def evaluate_model(self, test_samples):
        """Evaluate model performance"""

        print("\n📊 Evaluating model performance...")

        self.model.eval()
        correct = 0
        total = 0

        test_dataset = DeFiTradingDataset(test_samples, self.tokenizer)
        test_loader = DataLoader(test_dataset, batch_size=32, shuffle=False)

        predictions = []
        actuals = []

        with torch.no_grad():
            for batch in test_loader:
                input_ids = batch['input_ids'].to(self.device)
                attention_mask = batch['attention_mask'].to(self.device)
                labels = batch['labels'].to(self.device)

                outputs = self.model(
                    input_ids=input_ids,
                    attention_mask=attention_mask
                )

                preds = torch.argmax(outputs.logits, dim=-1)
                predictions.extend(preds.cpu().numpy())
                actuals.extend(labels.cpu().numpy())

                correct += (preds == labels).sum().item()
                total += labels.size(0)

        accuracy = correct / total
        print(f"✅ Accuracy: {accuracy:.2%}")

        # Calculate per-class metrics
        from sklearn.metrics import classification_report
        labels = ['SELL', 'HOLD', 'BUY']
        report = classification_report(actuals, predictions, target_names=labels)
        print("\nClassification Report:")
        print(report)

        return accuracy

class AdvancedDeFiModel(nn.Module):
    """Advanced neural network for DeFi trading signals"""

    def __init__(self, input_dim=10, hidden_dim=256, num_layers=3):
        super().__init__()

        # LSTM for sequential data
        self.lstm = nn.LSTM(
            input_dim,
            hidden_dim,
            num_layers,
            batch_first=True,
            dropout=0.2
        )

        # Attention mechanism
        self.attention = nn.MultiheadAttention(hidden_dim, num_heads=8)

        # Final classifier
        self.classifier = nn.Sequential(
            nn.Linear(hidden_dim, 128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(64, 3)  # BUY, HOLD, SELL
        )

    def forward(self, x):
        # LSTM encoding
        lstm_out, _ = self.lstm(x)

        # Self-attention
        attn_out, _ = self.attention(lstm_out, lstm_out, lstm_out)

        # Global pooling
        pooled = torch.mean(attn_out, dim=1)

        # Classification
        output = self.classifier(pooled)

        return output

async def main():
    """Main training pipeline"""

    print("="*60)
    print("🎓 DEFI MODEL TRAINING PIPELINE")
    print("Fine-tuning blockchain models for trading")
    print("="*60)

    # Collect data
    collector = DeFiDataCollector()
    raw_data = await collector.collect_training_data(days=7)

    # Prepare dataset
    training_samples = collector.prepare_training_dataset(raw_data)

    # Train model
    trainer = DeFiModelTrainer(base_model='ElKulako/cryptobert')
    trained_model = trainer.train(training_samples, epochs=2, batch_size=8)

    # Evaluate
    test_samples = training_samples[-50:]  # Last 50 samples for testing
    accuracy = trainer.evaluate_model(test_samples)

    print("\n" + "="*60)
    print("🎉 TRAINING COMPLETE!")
    print(f"   Final Accuracy: {accuracy:.2%}")
    print(f"   Model saved to: ./defi-trading-model-final")
    print("="*60)

    # Show GPU usage
    if torch.cuda.is_available():
        print(f"\n💾 GPU Memory Usage:")
        print(f"   Allocated: {torch.cuda.memory_allocated()/1e9:.2f} GB")
        print(f"   Reserved: {torch.cuda.memory_reserved()/1e9:.2f} GB")
        print(f"   Max Used: {torch.cuda.max_memory_allocated()/1e9:.2f} GB")

if __name__ == "__main__":
    asyncio.run(main())