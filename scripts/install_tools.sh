#!/bin/bash

# PentDash Lean Tools Installer (Ubuntu / WSL)
echo "Updating system..."
sudo apt update

echo "Installing base utilities and Python/Go..."
sudo apt install -y python3-pip golang git wget curl unzip

echo "Installing core network & web tools via apt..."
# Removed heavy/redundant tools: masscan, recon-ng, medusa, ncrack, john, hashcat, aircrack-ng, tshark, wfuzz, dirsearch
sudo apt install -y nmap nikto sqlmap hydra tcpdump ffuf gobuster

# echo "Installing essential Go-based tools..."
# export PATH=$PATH:/usr/local/go/bin:~/go/bin

# Removed heavy/redundant Go tools: amass, naabu
# go install github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest
# go install github.com/tomnomnom/assetfinder@latest
# go install github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest
# go install github.com/feroxbuster/feroxbuster@latest

echo "Installing lightweight Python-based tools..."
# Removed niche/heavy tools: droopescan, sstimap, commix, bloodhound, semgrep, trivy, checkov, pentestgpt
pip3 install shodan xsstrike crackmapexec trufflehog gitleaks impacket theHarvester --break-system-packages

echo "Done! The toolset has been stripped down to the fast, essential core."
echo "(Remember to run 'source ~/.bashrc' or restart your terminal if Go tools aren't found.)"
