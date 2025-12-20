---
title: "Docker-OSX: Running macOS Sequoia 15.1 on Proxmox VM"
date: "2025-12-17"
excerpt: "A step-by-step guide to running macOS Sequoia 15.1 in a Docker container on a Proxmox VM with nested virtualization, KVM passthrough, and VNC access."
tags: ["Docker", "macOS", "Proxmox", "Virtualization", "KVM", "Homelab", "Self-Hosted"]
author: "Juan"
category: "Tutorial"
featuredImage: ""
published: true
readTime: "5 min read"
---

# Docker-OSX: Running macOS Sequoia 15.1 on Proxmox VM

## Introduction

Running macOS in a virtualized environment opens up possibilities for iOS development, testing, and experimentation without dedicated Apple hardware. Docker-OSX makes this process remarkably straightforward by packaging macOS with QEMU inside a Docker container.

This guide walks through setting up macOS Sequoia 15.1 on a Proxmox VM using Docker-OSX, with VNC access for the graphical interface and SSH for remote management.

## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Setup Steps](#setup-steps)
- [Running Docker-OSX](#running-docker-osx)
- [Installing macOS](#installing-macos)
- [Useful Commands](#useful-commands)
- [Port Reference](#port-reference)
- [Troubleshooting](#troubleshooting)
- [Conclusion](#conclusion)

## Prerequisites

Before starting, ensure your environment meets these requirements:

- **Proxmox VM** with nested virtualization enabled (`cpu: host`)
- **Debian 12** (or similar Linux distribution)
- **Docker** installed and running
- **/dev/kvm** available for hardware acceleration
- **Hardware**: 8+ CPU cores, 16GB+ RAM, 100GB+ disk recommended

## Setup Steps

### 1. Enable SSH Access to VM

From the Proxmox console, install and start the SSH server:

```bash
apt update && apt install -y openssh-server
systemctl enable --now ssh
```

This allows you to manage the VM remotely instead of through the Proxmox console.

### 2. Add SSH Key (Optional)

For passwordless authentication, generate a key on your local machine:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N ""
```

Then add it to the VM via the Proxmox console:

```bash
mkdir -p ~/.ssh && echo "YOUR_PUBLIC_KEY" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys
```

Replace `YOUR_PUBLIC_KEY` with the contents of `~/.ssh/id_ed25519.pub`.

### 3. Verify VM Requirements

Before proceeding, verify your VM has everything needed:

```bash
# Check KVM availability
ls -la /dev/kvm

# Check Docker installation
docker --version

# Check available resources
grep -c processor /proc/cpuinfo
free -h
df -h /
```

You should see `/dev/kvm` present, Docker installed, and sufficient resources allocated.

## Running Docker-OSX

### Launch the Sequoia Container

Run the following command to start macOS Sequoia:

```bash
docker run -d \
  --name macos-sequoia \
  --device /dev/kvm \
  -p 50922:10022 \
  -p 5999:5999 \
  -e GENERATE_UNIQUE=true \
  -e CPU='Haswell-noTSX' \
  -e CPUID_FLAGS='kvm=on,vendor=GenuineIntel,+invtsc,vmware-cpuid-freq=on' \
  -e SHORTNAME=sequoia \
  -e EXTRA='-vnc 0.0.0.0:99' \
  sickcodes/docker-osx:latest
```

**Key parameters explained:**

| Parameter | Purpose |
|-----------|---------|
| `--device /dev/kvm` | Passes through KVM for hardware acceleration |
| `-p 50922:10022` | Maps SSH port (access macOS via SSH) |
| `-p 5999:5999` | Maps VNC port (graphical access) |
| `GENERATE_UNIQUE=true` | Generates unique serial numbers |
| `CPU='Haswell-noTSX'` | CPU type compatible with macOS |
| `SHORTNAME=sequoia` | Specifies macOS version |
| `EXTRA='-vnc 0.0.0.0:99'` | Enables VNC on display :99 (port 5999) |

### Monitor Progress

Watch the container logs to track the startup process:

```bash
# Stream logs
docker logs -f macos-sequoia

# Check if QEMU is running
docker exec macos-sequoia ps aux | grep qemu
```

The initial boot may take several minutes as the container sets up the virtual machine.

## Installing macOS

### Connect via VNC

Use any VNC client to connect:

- **Address:** `<VM_IP>:5999`
- **Clients:** TigerVNC, RealVNC, Remmina, or the built-in macOS Screen Sharing

### Installation Process

1. In the macOS Recovery environment, select **Disk Utility**
2. Select the virtual disk (usually the largest unformatted drive)
3. Click **Erase** and format as **APFS** with the name "Macintosh HD"
4. Close Disk Utility
5. Select **Reinstall macOS Sequoia**
6. Follow the installation wizard

The installation typically takes 30-60 minutes depending on your hardware. The VM will reboot several times during the process.

## Useful Commands

### Container Management

```bash
# Stop the container
docker stop macos-sequoia

# Start the container
docker start macos-sequoia

# Restart the container
docker restart macos-sequoia

# Remove the container (deletes all data!)
docker rm -f macos-sequoia

# View container status
docker ps -a | grep macos
```

### Accessing macOS

```bash
# SSH into macOS (after initial setup)
ssh user@<VM_IP> -p 50922
```

Note: SSH access requires enabling Remote Login in macOS System Settings after installation.

### Resource Monitoring

```bash
# Check container resource usage
docker stats macos-sequoia

# View detailed container info
docker inspect macos-sequoia
```

## Port Reference

| Port | Purpose |
|------|---------|
| 5999 | VNC display (graphical access) |
| 50922 | SSH to macOS guest |

## Troubleshooting

### No /dev/kvm

**Symptom:** Container fails to start with KVM-related errors.

**Solution:** Enable nested virtualization in Proxmox VM settings:
1. Shut down the VM
2. Edit VM hardware settings
3. Set CPU type to `host`
4. Start the VM and verify `/dev/kvm` exists

### Slow Performance

**Symptom:** macOS is sluggish or unresponsive.

**Solutions:**
- Increase RAM allocation (16GB+ recommended)
- Increase CPU cores (8+ recommended)
- Ensure KVM is being used (not software emulation)
- Check host system isn't resource-constrained

### VNC Won't Connect

**Symptom:** VNC client can't reach the VM.

**Solutions:**
- Verify the container is running: `docker ps`
- Check firewall rules allow port 5999
- Confirm the correct IP address
- Try connecting to `VM_IP:5999` not `VM_IP:99`

### Container Exits Immediately

**Symptom:** Container stops right after starting.

**Solutions:**
- Check logs: `docker logs macos-sequoia`
- Verify sufficient disk space: `df -h`
- Ensure Docker has permission to access `/dev/kvm`

## Persistence and Data

By default, the container's virtual disk is stored in a Docker volume. To persist data across container recreations:

```bash
# Create a named volume
docker volume create macos-data

# Run with persistent storage
docker run -d \
  --name macos-sequoia \
  --device /dev/kvm \
  -p 50922:10022 \
  -p 5999:5999 \
  -v macos-data:/home/arch/OSX-KVM/mac_hdd_ng.img \
  -e GENERATE_UNIQUE=true \
  -e CPU='Haswell-noTSX' \
  -e CPUID_FLAGS='kvm=on,vendor=GenuineIntel,+invtsc,vmware-cpuid-freq=on' \
  -e SHORTNAME=sequoia \
  -e EXTRA='-vnc 0.0.0.0:99' \
  sickcodes/docker-osx:latest
```

## Conclusion

Docker-OSX provides a convenient way to run macOS in virtualized environments without complex setup procedures. Combined with Proxmox's nested virtualization capabilities, you can have a fully functional macOS Sequoia instance running in your homelab.

This setup is ideal for:
- iOS/macOS development and testing
- Learning macOS system administration
- Running macOS-specific software
- Building CI/CD pipelines for Apple platforms

Remember that running macOS on non-Apple hardware may have legal implications depending on your jurisdiction and use case. This guide is intended for educational and development purposes.

## Further Reading

- [Docker-OSX GitHub Repository](https://github.com/sickcodes/Docker-OSX)
- [Proxmox VE Documentation](https://pve.proxmox.com/wiki/Main_Page)
- [QEMU Documentation](https://www.qemu.org/documentation/)
- [KVM Nested Virtualization](https://www.linux-kvm.org/page/Nested_Guests)

---

*Virtualize responsibly.*
