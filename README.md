<p align="center">
  <img src="assets/agentnest-icon.png" alt="AgentNest icon" width="160" />
</p>

<h1 align="center">AgentNest</h1>

<p align="center">
  <strong>A separate, local Linux computer for your AI coding agent.</strong>
</p>

<p align="center">
  Let Codex, Claude, and other MCP-capable agents run, see, click, type, and
  test inside a dedicated Ubuntu workspace—without taking over your Mac.
</p>

<p align="center">
  <img alt="macOS 13+" src="https://img.shields.io/badge/macOS-13%2B-111827?style=flat-square&logo=apple&logoColor=white" />
  <img alt="Intel x86_64" src="https://img.shields.io/badge/Intel-x86__64-0071C5?style=flat-square&logo=intel&logoColor=white" />
  <img alt="Ubuntu 24.04" src="https://img.shields.io/badge/Ubuntu-24.04-E95420?style=flat-square&logo=ubuntu&logoColor=white" />
  <img alt="MCP" src="https://img.shields.io/badge/MCP-native-10B981?style=flat-square" />
  <img alt="Telemetry" src="https://img.shields.io/badge/telemetry-none-10B981?style=flat-square" />
</p>

> [!NOTE]
> AgentNest is currently a private beta for Intel Macs. This public repository
> is a product showcase; the proprietary source code is maintained privately.

![AgentNest overview](assets/agentnest-overview.png)

## The idea

AI coding agents become dramatically more useful when they can run and inspect
their own work. AgentNest gives them a dedicated Ubuntu 24.04 desktop with
terminal and visual controls while keeping the normal host workspace isolated
by default.

It combines a native macOS control center, a reproducible VirtualBox workspace,
and a local MCP server into one focused product.

## What AgentNest provides

| Capability | Experience |
| --- | --- |
| Dedicated Linux computer | Ubuntu 24.04 LTS with XFCE/X11 |
| Native Mac control center | Start, stop, preview, diagnose, recover, and configure |
| Agent-native operation | Terminal, screenshots, mouse, keyboard, and checkpoints over MCP |
| Safer host boundary | Clipboard, drag-and-drop, USB, audio, recording, and VRDE disabled |
| Deliberate file access | Host folders are opt-in and read-only |
| Reliable experimentation | Clean baseline restores and named checkpoints |
| Local-first privacy | Loopback-only SSH, local logs, and no product telemetry |
| Broad integrations | Codex, Claude Desktop, editors, CLIs, and standard MCP clients |

## Product tour

<table>
  <tr>
    <td width="50%"><img src="assets/agentnest-overview.png" alt="Workspace overview" /></td>
    <td width="50%"><img src="assets/agentnest-settings.png" alt="Application settings" /></td>
  </tr>
  <tr>
    <td align="center"><strong>Workspace status and live preview</strong></td>
    <td align="center"><strong>Account, license, language, appearance, and privacy</strong></td>
  </tr>
</table>

## Architecture

```mermaid
flowchart LR
    A[Codex / Claude / MCP client] -->|stdio MCP| B[AgentNest MCP server]
    B -->|localhost SSH| C[Ubuntu 24.04 VM]
    D[Native macOS app] -->|lifecycle| E[VirtualBox]
    D -->|status + preview| C
    E --> C
    C -. opt-in read-only mount .-> F[Selected host folder]

    style A fill:#111827,color:#fff,stroke:#10b981
    style B fill:#0f766e,color:#fff,stroke:#5eead4
    style C fill:#e95420,color:#fff,stroke:#fdba74
    style D fill:#0b3b66,color:#fff,stroke:#38bdf8
    style F fill:#374151,color:#fff,stroke:#9ca3af
```

## Security and privacy by default

- SSH is exposed through a localhost-only VirtualBox NAT forward.
- A dedicated SSH key and private known-hosts file are used.
- Host folders are unavailable until the user explicitly selects one.
- Selected folders are mounted read-only.
- Clipboard, drag-and-drop, USB, audio, recording, and VRDE are disabled.
- Sensitive log values are redacted locally.
- No usage analytics, advertising identifier, or remote crash reporter is used.

Virtualization reduces exposure; it does not make arbitrary code risk-free.
VirtualBox, the guest network, and software installed inside Ubuntu remain part
of the security boundary.

## Current platform

- Intel Mac (`x86_64`)
- macOS 13 or newer
- VirtualBox 7
- Ubuntu 24.04 LTS guest
- Swift/AppKit application
- Dependency-free Python MCP server

Apple Silicon, Windows, cloud VMs, writable host shares, and multi-VM fleets are
not part of the current private beta.

## Status

The native application, VM provisioner, MCP tools, recovery flow, editor
integrations, local account settings, offline signed-license verification, and
Intel DMG builder are implemented and tested on the primary supported host.

Public availability remains gated by Apple Developer ID/notarization, expanded
hardware validation, support policies, and final commercial decisions.

---

<p align="center">
  <strong>Local Linux. Deliberate access. A clean nest for your agent.</strong>
</p>
