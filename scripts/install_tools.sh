#!/bin/bash

# PentDash Lean Tools Installer (Ubuntu / WSL)
echo "Updating system..."
sudo apt update

echo "Installing base utilities and Python/Go..."
sudo apt install -y python3 python-is-python3 python3-pip python3-venv pipx golang git wget curl unzip

echo "Installing core network & web tools via apt..."
# Removed heavy/redundant tools: masscan, recon-ng, medusa, ncrack, john, hashcat, aircrack-ng, tshark, wfuzz, dirsearch
sudo apt install -y nmap nikto sqlmap hydra tcpdump ffuf gobuster

echo "Installing lightweight Python-based tools via pipx..."
# Using pipx instead of pip to comply with PEP 668 (externally managed environment)
pipx install shodan
pipx install crackmapexec
pipx install trufflehog
pipx install gitleaks

echo "Ensuring pipx path is set..."
pipx ensurepath

echo "Done! The toolset has been stripped down to the fast, essential core."
echo "(Remember to run 'source ~/.bashrc' or restart your terminal if tools aren't found.)"
