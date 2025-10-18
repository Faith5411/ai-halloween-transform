#!/usr/bin/env python3

"""
Local Text Generation with GPT-2
Demonstrates running language models on GPU
"""

import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer
import time

class LocalTextGenerator:
    def __init__(self, model_name='gpt2-medium'):
        """Initialize the text generator"""
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

        print(f"🚀 Initializing {model_name} on {self.device}")
        if self.device.type == 'cuda':
            print(f"   GPU: {torch.cuda.get_device_name(0)}")
            print(f"   VRAM: {torch.cuda.get_device_properties(0).total_memory / 1e9:.2f} GB\n")

        print("📦 Loading model and tokenizer...")
        self.tokenizer = GPT2Tokenizer.from_pretrained(model_name)
        self.model = GPT2LMHeadModel.from_pretrained(model_name)
        self.model = self.model.to(self.device)
        self.model.eval()

        # Set padding token
        self.tokenizer.pad_token = self.tokenizer.eos_token

        model_size = sum(p.numel() for p in self.model.parameters())
        print(f"✅ Model loaded: {model_size/1e6:.1f}M parameters")
        print(f"💾 GPU Memory used: {torch.cuda.memory_allocated()/1e6:.2f} MB\n")

    def generate(self, prompt, max_length=100, temperature=0.8, top_k=50, top_p=0.95):
        """Generate text from a prompt"""
        print(f"📝 Prompt: {prompt}")
        print("🔄 Generating...\n")

        # Encode prompt
        input_ids = self.tokenizer.encode(prompt, return_tensors='pt').to(self.device)

        # Generate
        start_time = time.time()

        with torch.no_grad():
            output = self.model.generate(
                input_ids,
                max_length=max_length,
                temperature=temperature,
                top_k=top_k,
                top_p=top_p,
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id
            )

        generation_time = time.time() - start_time

        # Decode output
        generated_text = self.tokenizer.decode(output[0], skip_special_tokens=True)

        tokens_generated = len(output[0]) - len(input_ids[0])
        tokens_per_second = tokens_generated / generation_time

        print("="*60)
        print("📄 GENERATED TEXT:")
        print("="*60)
        print(generated_text)
        print("="*60)
        print(f"\n⚡ Performance:")
        print(f"   Tokens generated: {tokens_generated}")
        print(f"   Time: {generation_time:.2f} seconds")
        print(f"   Speed: {tokens_per_second:.1f} tokens/second")

        return generated_text

    def interactive_mode(self):
        """Interactive text generation mode"""
        print("="*60)
        print("💬 INTERACTIVE MODE")
        print("Type 'quit' to exit")
        print("="*60)

        while True:
            prompt = input("\n🎯 Enter prompt: ")

            if prompt.lower() == 'quit':
                break

            try:
                max_length = int(input("📏 Max length (default 100): ") or "100")
                temperature = float(input("🌡️  Temperature (0.1-2.0, default 0.8): ") or "0.8")

                self.generate(prompt, max_length=max_length, temperature=temperature)

            except KeyboardInterrupt:
                break
            except Exception as e:
                print(f"❌ Error: {e}")

    def benchmark_generation(self):
        """Benchmark generation speed"""
        print("\n" + "="*60)
        print("📊 GENERATION SPEED BENCHMARK")
        print("="*60)

        prompts = [
            "The future of artificial intelligence",
            "Once upon a time in a galaxy far away",
            "The key to happiness is",
            "In the year 2050, technology will"
        ]

        lengths = [50, 100, 200]

        for length in lengths:
            print(f"\n📏 Generating {length} tokens:")
            total_time = 0
            total_tokens = 0

            for prompt in prompts:
                input_ids = self.tokenizer.encode(prompt, return_tensors='pt').to(self.device)

                start_time = time.time()

                with torch.no_grad():
                    output = self.model.generate(
                        input_ids,
                        max_length=length,
                        temperature=0.8,
                        do_sample=True,
                        pad_token_id=self.tokenizer.eos_token_id
                    )

                generation_time = time.time() - start_time
                tokens_generated = len(output[0]) - len(input_ids[0])

                total_time += generation_time
                total_tokens += tokens_generated

            avg_speed = total_tokens / total_time
            print(f"   Average speed: {avg_speed:.1f} tokens/second")

        print(f"\n💾 Peak GPU memory: {torch.cuda.max_memory_allocated()/1e6:.2f} MB")

def demo_different_models():
    """Demo different model sizes"""
    print("="*60)
    print("🤖 MODEL SIZE COMPARISON")
    print("="*60)

    models = ['gpt2', 'gpt2-medium']  # You can add 'gpt2-large' if you have enough VRAM

    for model_name in models:
        print(f"\n📦 Testing {model_name}...")

        try:
            generator = LocalTextGenerator(model_name)

            prompt = "The meaning of life is"
            start_time = time.time()

            with torch.no_grad():
                input_ids = generator.tokenizer.encode(prompt, return_tensors='pt').to(generator.device)
                output = generator.model.generate(input_ids, max_length=50)

            generation_time = time.time() - start_time

            print(f"   ✅ Generation time (50 tokens): {generation_time:.2f}s")
            print(f"   💾 Memory used: {torch.cuda.memory_allocated()/1e6:.2f} MB")

            # Clean up
            del generator
            torch.cuda.empty_cache()

        except Exception as e:
            print(f"   ❌ Failed: {e}")

if __name__ == "__main__":
    try:
        # Create generator with GPT-2 Medium
        generator = LocalTextGenerator('gpt2-medium')

        # Example generations
        print("="*60)
        print("📝 EXAMPLE GENERATIONS")
        print("="*60)

        examples = [
            "The secret to mastering AI programming is",
            "In the depths of the neural network",
            "When robots dream, they dream of"
        ]

        for prompt in examples:
            generator.generate(prompt, max_length=80, temperature=0.8)
            print()

        # Benchmark
        generator.benchmark_generation()

        # Interactive mode
        print("\n" + "="*60)
        response = input("🎮 Start interactive mode? (y/n): ")
        if response.lower() == 'y':
            generator.interactive_mode()

    except Exception as e:
        print(f"❌ Error: {e}")
        print("\n📦 Installation required:")
        print("pip3 install transformers torch accelerate")