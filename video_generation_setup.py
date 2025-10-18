"""
Local Video Generation Setup for Halloween AI App
Using Hugging Face Models
"""

import torch
from diffusers import (
    CogVideoXPipeline,
    CogVideoXImageToVideoPipeline,
    StableVideoDiffusionPipeline,
    AnimateDiffPipeline,
    I2VGenXLPipeline
)
import gc

class VideoGenerator:
    def __init__(self, model_type="svd", device="cuda", low_vram=False):
        """
        Initialize video generator with selected model

        Args:
            model_type: "svd", "cogvideo-2b", "cogvideo-5b", "animatediff", "i2vgen"
            device: "cuda" or "cpu"
            low_vram: Enable memory optimizations for <8GB VRAM
        """
        self.device = device
        self.low_vram = low_vram
        self.model_type = model_type
        self.pipe = None

    def load_stable_video_diffusion(self):
        """Load SVD - Most balanced option (8-12GB VRAM)"""
        model_id = "stabilityai/stable-video-diffusion-img2vid-xt"

        self.pipe = StableVideoDiffusionPipeline.from_pretrained(
            model_id,
            torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
            variant="fp16" if self.device == "cuda" else None
        )

        if self.low_vram:
            # Enable memory optimizations
            self.pipe.enable_sequential_cpu_offload()
            self.pipe.vae.enable_slicing()
            self.pipe.vae.enable_tiling()
        else:
            self.pipe = self.pipe.to(self.device)

        return self.pipe

    def load_cogvideo_2b(self):
        """Load CogVideoX-2B - Entry level (6-18GB VRAM)"""
        model_id = "THUDM/CogVideoX-2b"

        self.pipe = CogVideoXImageToVideoPipeline.from_pretrained(
            model_id,
            torch_dtype=torch.float16
        )

        if self.low_vram:
            # Aggressive memory optimizations for 6GB VRAM
            self.pipe.enable_sequential_cpu_offload()
            self.pipe.vae.enable_slicing()
            self.pipe.enable_model_cpu_offload()
        else:
            self.pipe = self.pipe.to(self.device)

        return self.pipe

    def load_cogvideo_5b(self):
        """Load CogVideoX-5B - High quality (12-26GB VRAM)"""
        model_id = "THUDM/CogVideoX-5b-I2V"  # Image-to-video version

        self.pipe = CogVideoXImageToVideoPipeline.from_pretrained(
            model_id,
            torch_dtype=torch.bfloat16  # 5B was trained in BF16
        )

        if self.low_vram:
            # Optimizations to run on 12GB VRAM
            self.pipe.enable_sequential_cpu_offload()
            self.pipe.vae.enable_slicing()
        else:
            self.pipe = self.pipe.to(self.device)

        return self.pipe

    def load_animatediff(self):
        """Load AnimateDiff - Lightest option (4-8GB VRAM)"""
        # AnimateDiff works with any SD model - using a horror-themed one
        model_id = "runwayml/stable-diffusion-v1-5"  # Base model
        adapter_id = "guoyww/animatediff-motion-adapter-v1-5-2"

        self.pipe = AnimateDiffPipeline.from_pretrained(
            model_id,
            motion_adapter=adapter_id,
            torch_dtype=torch.float16
        )

        if self.low_vram:
            self.pipe.enable_sequential_cpu_offload()
            self.pipe.vae.enable_slicing()
        else:
            self.pipe = self.pipe.to(self.device)

        return self.pipe

    def load_i2vgen_xl(self):
        """Load I2VGen-XL - Good middle ground (10-16GB VRAM)"""
        model_id = "ali-vilab/i2vgen-xl"

        self.pipe = I2VGenXLPipeline.from_pretrained(
            model_id,
            torch_dtype=torch.float16,
            variant="fp16"
        )

        if self.low_vram:
            self.pipe.enable_sequential_cpu_offload()
            self.pipe.vae.enable_slicing()
        else:
            self.pipe = self.pipe.to(self.device)

        return self.pipe

    def generate_video(self, image, prompt=None, num_frames=25, fps=7):
        """
        Generate video from image

        Args:
            image: PIL Image or path to image
            prompt: Optional text prompt for guidance
            num_frames: Number of frames to generate
            fps: Frames per second for output

        Returns:
            Video frames as numpy array
        """
        if self.pipe is None:
            # Load the selected model
            if self.model_type == "svd":
                self.load_stable_video_diffusion()
            elif self.model_type == "cogvideo-2b":
                self.load_cogvideo_2b()
            elif self.model_type == "cogvideo-5b":
                self.load_cogvideo_5b()
            elif self.model_type == "animatediff":
                self.load_animatediff()
            elif self.model_type == "i2vgen":
                self.load_i2vgen_xl()

        # Generate video based on model type
        if self.model_type in ["svd", "cogvideo-2b", "cogvideo-5b"]:
            frames = self.pipe(
                image=image,
                num_frames=num_frames,
                decode_chunk_size=2 if self.low_vram else 8,
                generator=torch.manual_seed(42)
            ).frames[0]
        elif self.model_type == "animatediff":
            # AnimateDiff needs a prompt
            if prompt is None:
                prompt = "halloween transformation, spooky atmosphere, cinematic"
            frames = self.pipe(
                prompt=prompt,
                image=image,
                num_frames=num_frames,
                guidance_scale=7.5,
                num_inference_steps=25
            ).frames[0]
        elif self.model_type == "i2vgen":
            frames = self.pipe(
                image=image,
                prompt=prompt,
                num_frames=num_frames,
                generator=torch.manual_seed(42)
            ).frames[0]

        # Clear cache if low VRAM
        if self.low_vram:
            gc.collect()
            torch.cuda.empty_cache()

        return frames

    def save_video(self, frames, output_path="halloween_transformation.mp4", fps=7):
        """Save frames as video file"""
        import imageio

        # Convert frames to video
        imageio.mimwrite(output_path, frames, fps=fps)
        print(f"Video saved to {output_path}")

        return output_path


# Example usage for Halloween app
if __name__ == "__main__":
    from PIL import Image

    # Check available VRAM
    if torch.cuda.is_available():
        vram_gb = torch.cuda.get_device_properties(0).total_memory / 1e9
        print(f"Available VRAM: {vram_gb:.1f} GB")

        # Auto-select model based on VRAM
        if vram_gb < 8:
            model_type = "animatediff"  # Lightest
            low_vram = True
        elif vram_gb < 12:
            model_type = "svd"  # Balanced
            low_vram = True
        elif vram_gb < 16:
            model_type = "cogvideo-2b"  # Good quality
            low_vram = False
        else:
            model_type = "cogvideo-5b"  # Best quality
            low_vram = False

        print(f"Selected model: {model_type}")
    else:
        print("No GPU detected, using CPU (will be slow)")
        model_type = "animatediff"
        low_vram = True

    # Initialize generator
    generator = VideoGenerator(
        model_type=model_type,
        device="cuda" if torch.cuda.is_available() else "cpu",
        low_vram=low_vram
    )

    # Example: Generate video from Halloween transformation image
    # image = Image.open("halloween_transformation.png")
    # frames = generator.generate_video(
    #     image=image,
    #     prompt="spooky halloween transformation, ghost effect, cinematic horror",
    #     num_frames=25,
    #     fps=7
    # )
    # generator.save_video(frames, "halloween_video.mp4")