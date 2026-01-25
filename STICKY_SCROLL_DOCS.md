# Sticky Scroll Cards - Technical Documentation

## Overview

The sticky scroll card stack is the signature feature of the Innovation Business Services website. It creates a smooth, professional stacking effect as users scroll through the page.

## Implementation Details

### Technology
- **Framer Motion**: For scroll-based animations
- **React Hooks**: useRef, useScroll, useTransform
- **CSS**: Sticky positioning with dynamic top values

### How It Works

#### 1. Card Data Structure
```typescript
interface Card {
  id: number
  title: string
  text: string
  cta?: {
    text: string
    href: string
  }
}
```

#### 2. Scroll Progress Tracking
```typescript
const { scrollYProgress } = useScroll({
  target: cardRef,
  offset: ['start end', 'start start']
})
```

This tracks when each card enters the viewport:
- `'start end'`: When the card's top hits the viewport bottom
- `'start start'`: When the card's top hits the viewport top

#### 3. Animation Transforms
```typescript
const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1])
const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 0.8, 1])
```

- **Scale**: Cards start at 90% size and grow to 100%
- **Opacity**: Cards fade from 60% → 80% → 100% as they come into focus

#### 4. Sticky Positioning
```typescript
style={{ top: `${80 + index * 20}px` }}
```

Each card sticks at a slightly different position:
- Card 1: 80px from top
- Card 2: 100px from top
- Card 3: 120px from top
- Card 4: 140px from top
- Card 5: 160px from top

This creates the stacked appearance.

## Visual Behavior

### As User Scrolls Down:

1. **Card Enters Viewport**
   - Opacity: 60%
   - Scale: 90%
   - Position: Below previous card

2. **Card Comes Into Focus**
   - Opacity increases to 100%
   - Scale increases to 100%
   - Card becomes "sticky" at its designated position

3. **Previous Card**
   - Remains partially visible above
   - Maintains its stuck position
   - Creates stacked visual effect

4. **Final Card**
   - Includes CTA button
   - Full opacity and scale when in focus
   - Last card in the sequence

## Code Example

```tsx
<div
  ref={cardRef}
  className="sticky top-20 mb-12"
  style={{ top: `${80 + index * 20}px` }}
>
  <motion.div
    style={{ scale, opacity }}
    className="bg-white rounded-2xl shadow-xl p-12"
  >
    {/* Card content */}
  </motion.div>
</div>
```

## Customization Options

### Adjust Stacking Offset
Change the spacing between stacked cards:
```typescript
// More spread out
style={{ top: `${80 + index * 30}px` }}

// Tighter stacking
style={{ top: `${80 + index * 10}px` }}
```

### Modify Animation Speed
Adjust the scroll offset for faster/slower transitions:
```typescript
// Slower (longer scroll distance)
offset: ['start end', 'center start']

// Faster (shorter scroll distance)
offset: ['start 80%', 'start 20%']
```

### Change Scale Range
Make cards grow more or less:
```typescript
// More dramatic
const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1])

// More subtle
const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1])
```

### Adjust Opacity Fade
Control how cards fade in:
```typescript
// Quicker fade to full opacity
const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.6, 1, 1])

// Gradual fade throughout scroll
const opacity = useTransform(scrollYProgress, [0, 1], [0.5, 1])
```

## Performance Considerations

### Optimizations in Place:
1. **Single scroll listener** - Framer Motion handles efficiently
2. **GPU acceleration** - Transform properties use hardware acceleration
3. **No layout thrashing** - Transforms don't trigger reflows
4. **Ref-based targeting** - Specific element tracking, not window scroll

### Best Practices:
- Keep card content lightweight
- Avoid heavy images inside cards
- Use transform properties (not top/left) for animations
- Limit number of cards to 5-7 for best UX

## Troubleshooting

### Cards Not Sticking
**Issue**: Cards scroll past instead of sticking
**Solution**: Ensure parent container has enough height
```tsx
<div className="relative">
  {cards.map(...)}
  <div className="h-screen" /> {/* Spacer for scroll */}
</div>
```

### Jerky Animation
**Issue**: Animation isn't smooth
**Solution**: 
1. Check no heavy computations during scroll
2. Ensure smooth scrolling is enabled
3. Verify transform properties are used (not position changes)

### Cards Too Close Together
**Issue**: Cards overlap too much
**Solution**: Increase the stacking offset multiplier
```typescript
style={{ top: `${80 + index * 30}px` }}
```

### Animation Not Triggering
**Issue**: No scale/opacity changes
**Solution**: 
1. Verify Framer Motion is installed
2. Check scroll offset values are correct
3. Ensure component is wrapped in motion.div

## Mobile Considerations

The sticky scroll works on mobile but with adjustments:

```tsx
// Responsive top positioning
className="sticky top-20 md:top-24"

// Reduced spacing on mobile
style={{ 
  top: `${window.innerWidth < 768 ? 60 + index * 15 : 80 + index * 20}px` 
}}

// Smaller minimum height on mobile
className="min-h-[400px] md:min-h-[500px]"
```

## Browser Support

Works in all modern browsers that support:
- CSS `position: sticky` (all modern browsers)
- CSS transforms (all modern browsers)
- Intersection Observer (Framer Motion requirement)

### Fallback Behavior:
If JavaScript is disabled or browser doesn't support sticky:
- Cards display as normal stacked elements
- Content remains fully accessible
- No animation but all information visible

## Inspiration & References

This implementation is inspired by:
- Raymmar's webflow sticky scroll pattern
- Apple's product page interactions
- Modern web design scroll-based storytelling

Key differences from reference:
- ✅ No complex parallax effects
- ✅ Simple scale and opacity only
- ✅ Professional, not playful
- ✅ Performance-optimized
- ✅ Accessible and fallback-friendly

## Content Guidelines

### Card Content Best Practices:
1. **Keep titles concise** - 8-12 words max
2. **Clear, actionable text** - 15-25 words per card
3. **Logical progression** - Each card should flow to the next
4. **Final CTA** - Last card should have clear call-to-action
5. **Consistent structure** - All cards follow same pattern

### Current Card Sequence:
1. **Problem Introduction** - "We help you set up..."
2. **Solution Overview** - "LLCs, paperwork, and business setup..."
3. **Process Value** - "Every business follows the same basic steps..."
4. **Risk Mitigation** - "Small mistakes can cause big delays..."
5. **Call to Action** - "Let's talk about your business..."

This creates a narrative flow that builds trust and leads to conversion.

## Testing Checklist

- [ ] Smooth scrolling on desktop
- [ ] No jank or stuttering
- [ ] Cards stack properly
- [ ] Opacity transitions work
- [ ] Scale transitions work
- [ ] Mobile responsive behavior
- [ ] Touch scrolling works on mobile
- [ ] Final card CTA is visible and clickable
- [ ] Works in Chrome, Firefox, Safari, Edge
- [ ] Accessible via keyboard navigation

## Future Enhancements (Optional)

Possible improvements while maintaining professionalism:

1. **Progress Indicator**
   - Subtle line showing scroll progress through cards

2. **Active Card Highlight**
   - Very subtle border or shadow on focused card

3. **Content Fade-In**
   - Individual elements fade in as card focuses

4. **Scroll Hint**
   - Subtle "scroll to continue" indicator

5. **Card Numbers**
   - Visual step counter (already implemented)

All enhancements should maintain the calm, professional aesthetic.
