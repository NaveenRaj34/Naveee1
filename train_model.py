"""
Root training shortcut script for JobShield AI
Usage: python train_model.py
"""
import os
import sys

# Add project root to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from ml.training.train_model import train

if __name__ == "__main__":
    train()
