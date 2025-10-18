#!/usr/bin/env python3

"""
Simple Image Classifier using Pre-trained ResNet50
Demonstrates GPU acceleration for computer vision tasks
"""

import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import requests
import json
import time

def download_imagenet_labels():
    """Download ImageNet class labels"""
    url = "https://raw.githubusercontent.com/anishathalye/imagenet-simple-labels/master/imagenet-simple-labels.json"
    response = requests.get(url)
    return json.loads(response.text)

def classify_image(image_path, top_k=5):
    """Classify an image using ResNet50"""

    # Check CUDA availability
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"🚀 Using device: {device}")

    if device.type == 'cuda':
        print(f"   GPU: {torch.cuda.get_device_name(0)}")
        print(f"   VRAM: {torch.cuda.get_device_properties(0).total_memory / 1e9:.2f} GB")

    # Load pre-trained ResNet50
    print("\n📦 Loading ResNet50 model...")
    model = models.resnet50(pretrained=True)
    model = model.to(device)
    model.eval()

    # Image preprocessing
    preprocess = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

    # Load and preprocess image
    print(f"🖼️  Processing image: {image_path}")
    image = Image.open(image_path).convert('RGB')
    input_tensor = preprocess(image)
    input_batch = input_tensor.unsqueeze(0).to(device)

    # Inference
    print("🔍 Classifying...")
    start_time = time.time()

    with torch.no_grad():
        output = model(input_batch)

    inference_time = time.time() - start_time
    print(f"⚡ Inference time: {inference_time*1000:.2f} ms")

    # Get predictions
    probabilities = torch.nn.functional.softmax(output[0], dim=0)

    # Get labels
    labels = download_imagenet_labels()

    # Get top k predictions
    top_probs, top_indices = torch.topk(probabilities, top_k)

    print(f"\n🏆 Top {top_k} predictions:")
    for i in range(top_k):
        idx = top_indices[i].item()
        prob = top_probs[i].item()
        label = labels[idx]
        print(f"   {i+1}. {label:20s} - {prob*100:5.2f}%")

    # GPU memory stats
    if device.type == 'cuda':
        print(f"\n💾 GPU Memory used: {torch.cuda.memory_allocated()/1e6:.2f} MB")
        torch.cuda.empty_cache()

def download_sample_image():
    """Download a sample image for testing"""
    print("📥 Downloading sample image...")
    url = "https://upload.wikimedia.org/wikipedia/commons/2/26/YellowLabradorLooking_new.jpg"
    response = requests.get(url)

    with open("sample_dog.jpg", "wb") as f:
        f.write(response.content)

    return "sample_dog.jpg"

def benchmark_batch_processing():
    """Benchmark batch processing performance"""
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    print("\n" + "="*60)
    print("📊 BATCH PROCESSING BENCHMARK")
    print("="*60)

    model = models.resnet50(pretrained=True).to(device)
    model.eval()

    batch_sizes = [1, 8, 16, 32, 64]

    for batch_size in batch_sizes:
        # Create dummy batch
        dummy_input = torch.randn(batch_size, 3, 224, 224).to(device)

        # Warmup
        for _ in range(3):
            with torch.no_grad():
                _ = model(dummy_input)

        torch.cuda.synchronize()

        # Benchmark
        num_iterations = 50
        start_time = time.time()

        for _ in range(num_iterations):
            with torch.no_grad():
                _ = model(dummy_input)

        torch.cuda.synchronize()
        total_time = time.time() - start_time

        images_per_second = (batch_size * num_iterations) / total_time
        ms_per_image = 1000 * total_time / (batch_size * num_iterations)

        print(f"\nBatch size {batch_size:2d}:")
        print(f"   Speed: {images_per_second:7.1f} images/sec")
        print(f"   Latency: {ms_per_image:5.2f} ms/image")
        print(f"   GPU Memory: {torch.cuda.memory_allocated()/1e6:6.1f} MB")

        torch.cuda.empty_cache()

if __name__ == "__main__":
    print("="*60)
    print("🤖 GPU-ACCELERATED IMAGE CLASSIFIER")
    print("="*60)

    try:
        # Download sample image
        image_path = download_sample_image()

        # Classify the image
        classify_image(image_path, top_k=5)

        # Run benchmark
        benchmark_batch_processing()

    except Exception as e:
        print(f"❌ Error: {e}")
        print("Make sure PyTorch is installed with CUDA support:")
        print("pip3 install torch torchvision --index-url https://download.pytorch.org/whl/cu121")