# Website Structure

## Page Layout Diagram

```mermaid
graph TD
    A[Header/Navigation] --> B[Hero Section]
    B --> C[Projects Showcase]
    C --> D[Case Studies]
    D --> E[Live Demos]
    E --> F[Inquiry Form]
    F --> G[Footer]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#fce4ec
    style F fill:#f1f8e9
    style G fill:#fafafa
```

## Component Hierarchy

```mermaid
graph TD
    A[Portfolio Website] --> B[Header]
    A --> C[Main Content]
    A --> D[Footer]
    
    B --> B1[Logo]
    B --> B2[Navigation Menu]
    
    C --> C1[Hero Section]
    C --> C2[Projects]
    C --> C3[Case Studies]
    C --> C4[Demos]
    C --> C5[Contact Form]
    
    C1 --> C1A[Headline]
    C1 --> C1B[Subheadline]
    C1 --> C1C[Call to Action]
    
    C2 --> C2A[Project Card 1]
    C2 --> C2B[Project Card 2]
    C2 --> C2C[Project Card 3]
    
    C3 --> C3A[Case Study 1]
    C3 --> C3B[Case Study 2]
    
    C4 --> C4A[Demo 1]
    C4 --> C4B[Demo 2]
    
    C5 --> C5A[Form Fields]
    C5 --> C5B[Submit Button]
    
    D --> D1[Copyright]
    D --> D2[Social Links]
```

## Responsive Breakpoints

```mermaid
graph LR
    A[Mobile First] --> B[Tablet]
    B --> C[Desktop]
    
    A -->|max-width: 768px| A1[Single Column Layout]
    B -->|min-width: 769px| B1[Two Column Layout]
    C -->|min-width: 1024px| C1[Multi Column Layout]