#!/bin/bash

# DeFi Trading AI Setup Script

echo "="
echo "🚀 DEFI TRADING AI SETUP"
echo "="
echo ""

# Check GPU
echo "🔍 Checking GPU..."
nvidia-smi --query-gpu=name,memory.total --format=csv,noheader
echo ""

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv defi_env
source defi_env/bin/activate

# Install PyTorch with CUDA support
echo "🔧 Installing PyTorch with CUDA support..."
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# Install requirements
echo "📚 Installing requirements..."
pip install transformers accelerate bitsandbytes datasets
pip install web3 eth-account aiohttp requests pandas numpy scikit-learn
pip install pycoingecko

echo ""
echo "✅ Setup complete!"
echo ""
echo "To run the DeFi Trading AI:"
echo "  1. Activate environment: source defi_env/bin/activate"
echo "  2. Run trading bot: python3 defi_trading_ai.py"
echo "  3. Or train model: python3 train_defi_model.py"
echo ""