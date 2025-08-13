# Memory Cassette - Design Document

## Design Philosophy

A clean, minimalist cassette tape interface that evokes nostalgia while providing a simple, therapeutic experience for users to "dump" their thoughts. The design balances vintage aesthetics with modern usability.

## Visual Design

### Color Palette
- **Background**: Dark charcoal (#2a2a2a) for focus and calm
- **Cassette Body**: Warm beige (#d4c4a8) with subtle borders (#8b7355)
- **Reels**: Dark brown (#6b5b47) with rotating spokes
- **Display**: Cream (#f5f5dc) for readability
- **Sticky Note**: Bright yellow (#fff3a0) for attention
- **Text**: Dark gray (#3a3a3a) and medium brown (#8b7355)

### Layout Structure
```
┌─────────────────────────────────────┐
│           Dark Background           │
│  ┌─────────────────────────────┐   │
│  │     "dump your thoughts"    │   │ ← Sticky Note
│  │  ┌─────────────────────┐   │   │
│  │  │      Ready          │   │   │ ← Display
│  │  └─────────────────────┘   │   │
│  │                             │   │
│  │    ●─────────●─────────●    │   │ ← Rotating Reels
│  │                             │   │
│  │  ┌─────────────────────┐   │   │
│  │  │  Text Input Area    │   │   │
│  │  └─────────────────────┘   │   │
│  │         [Dump]              │   │ ← Action Button
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Typography
- **Primary Font**: Arial (clean, readable)
- **Monospace**: Courier New (for display elements)
- **Sizes**: 12-14px for body text, smaller for labels

### Interactive Elements

#### Cassette Reels
- Two circular reels with visible spokes
- Continuous rotation animation (8-second cycle)
- Dark spokes on brown background for visibility
- Perfect circles (85px × 85px)

#### Input Area
- Clean white background with subtle shadow
- Rounded corners for modern feel
- Placeholder text guides user interaction

#### Dump Button
- Rounded pill shape
- Brown background with white text
- Hover effects: darker color, slight lift
- Positioned below input for clear flow

### Animations
- **Reel Rotation**: Continuous 8s linear rotation
- **Button Hover**: Scale and shadow effects
- **Page Load**: Subtle fade-ins using GSAP
- **Interactions**: Smooth transitions and feedback

## User Experience

### Interaction Flow
1. User sees cassette with "dump your thoughts" sticky note
2. User clicks in text area (reels start spinning)
3. User types their thoughts
4. User clicks "Dump" button
5. System processes and provides feedback
6. User can start fresh or continue

### Accessibility
- High contrast text and backgrounds
- Clear focus indicators
- Keyboard navigation support
- Screen reader friendly structure
- Reduced motion options available

## Technical Implementation

### CSS Architecture
- CSS Custom Properties for consistent theming
- Flexbox for layout and alignment
- CSS animations for reel rotation
- Responsive design with media queries

### JavaScript Functionality
- GSAP for smooth animations
- Event handling for user interactions
- Dynamic content updates
- Local state management (no data persistence)

### Performance Considerations
- Minimal JavaScript footprint
- CSS-based animations where possible
- Optimized image assets
- Progressive enhancement approach
