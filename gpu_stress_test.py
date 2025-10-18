#!/usr/bin/env python3

"""
GPU Stress Test for NVIDIA GPUs
Tests compute performance, memory bandwidth, and thermal stability
"""

import torch
import torch.nn as nn
import numpy as np
import time
import sys
import threading
import subprocess
from datetime import datetime

class GPUStressTest:
    def __init__(self, gpu_id=0):
        self.gpu_id = gpu_id
        self.device = torch.device(f'cuda:{gpu_id}' if torch.cuda.is_available() else 'cpu')
        self.stop_flag = threading.Event()
        self.test_results = {}

        if not torch.cuda.is_available():
            print("❌ CUDA is not available. Please check your CUDA installation.")
            sys.exit(1)

        # Get GPU properties
        self.gpu_props = torch.cuda.get_device_properties(self.device)
        print(f"🎯 Target GPU: {self.gpu_props.name}")
        print(f"   Compute Capability: {self.gpu_props.major}.{self.gpu_props.minor}")
        print(f"   Total Memory: {self.gpu_props.total_memory / 1e9:.2f} GB")
        print(f"   CUDA Cores: {self.gpu_props.multi_processor_count * 128}")  # Approximate for modern GPUs
        print()

    def matrix_multiply_stress(self, duration=30, matrix_size=8192):
        """Stress test using intensive matrix multiplication"""
        print(f"🔥 Starting Matrix Multiplication Stress Test")
        print(f"   Duration: {duration} seconds")
        print(f"   Matrix Size: {matrix_size}x{matrix_size}")

        # Create large random matrices
        A = torch.randn(matrix_size, matrix_size, device=self.device, dtype=torch.float32)
        B = torch.randn(matrix_size, matrix_size, device=self.device, dtype=torch.float32)

        start_time = time.time()
        iterations = 0
        tflops_list = []

        while time.time() - start_time < duration and not self.stop_flag.is_set():
            torch.cuda.synchronize()
            iter_start = time.time()

            # Perform matrix multiplication
            C = torch.matmul(A, B)

            torch.cuda.synchronize()
            iter_time = time.time() - iter_start

            # Calculate TFLOPS (2 * n^3 operations for matrix multiply)
            operations = 2 * (matrix_size ** 3)
            tflops = (operations / iter_time) / 1e12
            tflops_list.append(tflops)

            iterations += 1

            if iterations % 10 == 0:
                avg_tflops = np.mean(tflops_list[-10:])
                print(f"   Iteration {iterations}: {avg_tflops:.2f} TFLOPS")

        avg_tflops = np.mean(tflops_list)
        self.test_results['matrix_multiply'] = {
            'iterations': iterations,
            'avg_tflops': avg_tflops,
            'peak_tflops': max(tflops_list)
        }

        print(f"✅ Matrix Multiply Complete: {iterations} iterations, {avg_tflops:.2f} avg TFLOPS")
        return avg_tflops

    def memory_bandwidth_stress(self, duration=30):
        """Test memory bandwidth with large data transfers"""
        print(f"\n💾 Starting Memory Bandwidth Stress Test")
        print(f"   Duration: {duration} seconds")

        # Allocate 4GB of memory (or 25% of available) to avoid OOM
        available_memory = torch.cuda.get_device_properties(self.device).total_memory
        test_size = min(4 * 1024**3, int(available_memory * 0.25))
        elements = test_size // 4  # float32 = 4 bytes

        print(f"   Test Size: {test_size / 1e9:.2f} GB")

        # Create source and destination tensors
        src = torch.randn(elements, device=self.device)
        dst = torch.empty_like(src)

        start_time = time.time()
        iterations = 0
        bandwidth_list = []

        while time.time() - start_time < duration and not self.stop_flag.is_set():
            torch.cuda.synchronize()
            iter_start = time.time()

            # Copy data
            dst.copy_(src)

            torch.cuda.synchronize()
            iter_time = time.time() - iter_start

            # Calculate bandwidth (GB/s)
            bandwidth = (test_size * 2) / iter_time / 1e9  # *2 for read+write
            bandwidth_list.append(bandwidth)

            iterations += 1

            if iterations % 10 == 0:
                avg_bandwidth = np.mean(bandwidth_list[-10:])
                print(f"   Iteration {iterations}: {avg_bandwidth:.2f} GB/s")

        avg_bandwidth = np.mean(bandwidth_list)
        self.test_results['memory_bandwidth'] = {
            'iterations': iterations,
            'avg_bandwidth_gbps': avg_bandwidth,
            'peak_bandwidth_gbps': max(bandwidth_list)
        }

        print(f"✅ Memory Bandwidth Test Complete: {avg_bandwidth:.2f} GB/s average")
        return avg_bandwidth

    def mixed_precision_stress(self, duration=30):
        """Stress test using mixed precision operations (FP16/FP32)"""
        print(f"\n⚡ Starting Mixed Precision Stress Test")
        print(f"   Duration: {duration} seconds")

        # Create a simple neural network for mixed precision
        class StressNet(nn.Module):
            def __init__(self):
                super().__init__()
                self.layers = nn.Sequential(
                    nn.Linear(4096, 8192),
                    nn.ReLU(),
                    nn.Linear(8192, 8192),
                    nn.ReLU(),
                    nn.Linear(8192, 4096),
                )

            def forward(self, x):
                return self.layers(x)

        model = StressNet().to(self.device)
        # Keep model in FP32, let autocast handle precision

        # Create random input in FP32
        batch_size = 256
        input_tensor = torch.randn(batch_size, 4096, device=self.device, dtype=torch.float32)

        start_time = time.time()
        iterations = 0

        # Use automatic mixed precision with correct API
        scaler = torch.amp.GradScaler('cuda')
        optimizer = torch.optim.SGD(model.parameters(), lr=0.01)

        while time.time() - start_time < duration and not self.stop_flag.is_set():
            optimizer.zero_grad()

            with torch.amp.autocast('cuda'):
                output = model(input_tensor)
                loss = output.mean()  # Use mean instead of sum

            # Proper backward pass with scaler
            scaler.scale(loss).backward()
            scaler.step(optimizer)
            scaler.update()

            iterations += 1

            if iterations % 100 == 0:
                print(f"   Iteration {iterations}: Mixed precision operations")

        self.test_results['mixed_precision'] = {
            'iterations': iterations,
            'iterations_per_second': iterations / duration
        }

        print(f"✅ Mixed Precision Test Complete: {iterations} iterations")
        return iterations

    def tensor_core_stress(self, duration=30):
        """Stress test specifically targeting Tensor Cores (RTX/Tesla GPUs)"""
        print(f"\n🎯 Starting Tensor Core Stress Test")
        print(f"   Duration: {duration} seconds")

        # Tensor Core operations require specific dimensions (multiples of 8)
        m, n, k = 8192, 8192, 8192

        # Create FP16 tensors for Tensor Core operations
        A = torch.randn(m, k, device=self.device, dtype=torch.half)
        B = torch.randn(k, n, device=self.device, dtype=torch.half)

        start_time = time.time()
        iterations = 0

        while time.time() - start_time < duration and not self.stop_flag.is_set():
            # Tensor Core accelerated operation
            C = torch.matmul(A, B)
            torch.cuda.synchronize()

            iterations += 1

            if iterations % 20 == 0:
                print(f"   Iteration {iterations}: Tensor Core operations")

        self.test_results['tensor_cores'] = {
            'iterations': iterations,
            'iterations_per_second': iterations / duration
        }

        print(f"✅ Tensor Core Test Complete: {iterations} iterations")
        return iterations

    def get_gpu_stats(self):
        """Get current GPU statistics using nvidia-smi"""
        try:
            cmd = [
                'nvidia-smi',
                f'--id={self.gpu_id}',
                '--query-gpu=temperature.gpu,utilization.gpu,utilization.memory,memory.used,memory.total,power.draw,power.limit',
                '--format=csv,noheader,nounits'
            ]
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            stats = result.stdout.strip().split(', ')

            return {
                'temperature': float(stats[0]),
                'gpu_util': float(stats[1]),
                'mem_util': float(stats[2]),
                'mem_used': float(stats[3]),
                'mem_total': float(stats[4]),
                'power_draw': float(stats[5]),
                'power_limit': float(stats[6])
            }
        except:
            return None

    def monitor_gpu(self):
        """Monitor GPU stats during stress test"""
        max_temp = 0
        max_power = 0
        max_util = 0

        while not self.stop_flag.is_set():
            stats = self.get_gpu_stats()
            if stats:
                max_temp = max(max_temp, stats['temperature'])
                max_power = max(max_power, stats['power_draw'])
                max_util = max(max_util, stats['gpu_util'])
            time.sleep(1)

        self.test_results['max_stats'] = {
            'max_temperature': max_temp,
            'max_power_draw': max_power,
            'max_gpu_utilization': max_util
        }

    def run_full_stress_test(self, duration_per_test=30):
        """Run all stress tests"""
        print("="*60)
        print("🚀 NVIDIA GPU STRESS TEST")
        print(f"   Total Duration: ~{duration_per_test * 4} seconds")
        print("="*60)
        print()

        # Start monitoring thread
        monitor_thread = threading.Thread(target=self.monitor_gpu)
        monitor_thread.start()

        try:
            # Run tests
            self.matrix_multiply_stress(duration_per_test)
            self.memory_bandwidth_stress(duration_per_test)
            self.mixed_precision_stress(duration_per_test)

            # Try Tensor Cores (may not be available on all GPUs)
            try:
                self.tensor_core_stress(duration_per_test)
            except:
                print("⚠️  Tensor Core test skipped (may not be supported)")

        except KeyboardInterrupt:
            print("\n\n⛔ Stress test interrupted by user")
        finally:
            self.stop_flag.set()
            monitor_thread.join()

        # Print results
        self.print_results()

    def print_results(self):
        """Print test results summary"""
        print("\n" + "="*60)
        print("📊 STRESS TEST RESULTS")
        print("="*60)

        if 'matrix_multiply' in self.test_results:
            result = self.test_results['matrix_multiply']
            print(f"\n🔥 Matrix Multiplication:")
            print(f"   Average TFLOPS: {result['avg_tflops']:.2f}")
            print(f"   Peak TFLOPS: {result['peak_tflops']:.2f}")

        if 'memory_bandwidth' in self.test_results:
            result = self.test_results['memory_bandwidth']
            print(f"\n💾 Memory Bandwidth:")
            print(f"   Average: {result['avg_bandwidth_gbps']:.2f} GB/s")
            print(f"   Peak: {result['peak_bandwidth_gbps']:.2f} GB/s")

        if 'mixed_precision' in self.test_results:
            result = self.test_results['mixed_precision']
            print(f"\n⚡ Mixed Precision:")
            print(f"   Total Iterations: {result['iterations']}")
            print(f"   Iterations/sec: {result['iterations_per_second']:.2f}")

        if 'tensor_cores' in self.test_results:
            result = self.test_results['tensor_cores']
            print(f"\n🎯 Tensor Cores:")
            print(f"   Total Iterations: {result['iterations']}")
            print(f"   Iterations/sec: {result['iterations_per_second']:.2f}")

        if 'max_stats' in self.test_results:
            stats = self.test_results['max_stats']
            print(f"\n📈 Maximum Values During Test:")
            print(f"   Peak Temperature: {stats['max_temperature']:.0f}°C")
            print(f"   Peak Power Draw: {stats['max_power_draw']:.0f}W")
            print(f"   Peak GPU Utilization: {stats['max_gpu_utilization']:.0f}%")

        print("\n" + "="*60)
        print("✅ Stress test complete!")
        print("="*60)

if __name__ == "__main__":
    # Check for command line arguments
    duration = 30  # Default 30 seconds per test
    if len(sys.argv) > 1:
        try:
            duration = int(sys.argv[1])
        except:
            print("Usage: python gpu_stress_test.py [duration_per_test_in_seconds]")
            print("Default: 30 seconds per test")
            sys.exit(1)

    # Run stress test
    stress_test = GPUStressTest()
    stress_test.run_full_stress_test(duration)