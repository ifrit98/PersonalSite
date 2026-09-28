# Part II. Attaching Order to Content

Source: https://shapeofmusic.org/essays/part-ii-attaching-order-to-content/ (GAMUT essay by Jason St George, as published)

## The same three notes

Play C, E, G, and then C, G, E. If the rhythm and instrument remain fixed, pitch order is the variable we have deliberately changed. Both figures use the collection `{0, 4, 7}` introduced in Part I. Every calculation based solely on membership gives them the same answer. To record the difference, write the ordered tuples `(0, 4, 7)` and `(0, 7, 4)`.

The tuples still omit much of a performance. They do not specify which octave contains G, how long E lasts, or whether the last note is accented. A pitch-class order is enough to describe the selected permutation; it is insufficient to reconstruct a recorded phrase. This is a useful distinction when designing controls: the representation of an operation can be small while the performance record remains rich.

GAMUT's discrete starting point is a rooted cyclic tuple of distinct pitch classes. Each word in that definition makes a choice. “Rooted” selects a first entry. “Cyclic” includes the return from the final entry to the first. “Distinct” excludes repeated pitch classes within the tuple. Here the root is 0, the selected starting pitch class, rather than a claim about a tonal root inferred by analysis.

## Closing a traversal

Suppose the three-note figure is intended to repeat. In `(0, 4, 7)`, the directed modular steps are four from 0 to 4, three from 4 to 7, and five from 7 back to 0. Its gap word is `(4, 3, 5)`. The reverse traversal `(0, 7, 4)` has gaps `(7, 9, 8)`.

The nine in the second word means that moving from 7 to 4 is an advance of nine modulo twelve. It could be realized as a descent of three semitones, an ascent of nine, or another registral displacement with the same pitch-class result. A modular gap does not choose the sounding direction or size of a leap.

Including the last-to-first step makes the loop explicit. It is appropriate for this repeating example. A phrase that ends with a pause or continues elsewhere need not be closed in performance. Applying the cyclic model to such a phrase is an analytical decision that should be recorded, not an extra note that the performer supposedly played.

Both gap words sum to zero modulo twelve: their ordinary integer sums are twelve and twenty-four. Closure requires the modular condition, not an ordinary sum of exactly twelve. The second traversal makes this easy to see.

## Reconstruction with conditions

Given the root and the directed gaps, cumulative addition recovers the tuple. Starting at 0 with `(4, 3, 5)`, we reach 4 and then 7; the last gap returns us to 0. Starting at 0 with `(7, 9, 8)`, we reach 7 and then 4 before returning. This is an exact reconstruction within the chosen model.

The gaps alone leave the initial pitch class unspecified. The same word can start at 2, producing a transposed traversal. The root supplies that missing placement. Conversely, arbitrary gaps do not necessarily describe an admissible tuple of distinct pitch classes. Closure and distinctness both need checking.

For example, `(4, 8, 0)` closes modulo twelve, but its successive positions from root 0 are 0, 4, and 0. It repeats a pitch class before the final return and therefore falls outside the distinct-note domain. More generally, the partial sums that define the tuple's entries must be pairwise distinct modulo twelve. Closure alone does not guarantee this.

The [Lean release](https://shapeofmusic.org/research/library/proof-manifest/) verifies reconstruction and related contracts with these domain requirements. Its precision is useful when an interface promises a reversible operation. It also tells us where a new specification is needed: repeated-note phrases, rests, and overlapping voices require a richer representation rather than an informal extension of this theorem.

## How many orderings belong above a collection?

For a fixed collection of three distinct notes and a fixed first note, the remaining two notes have two orders. These are exactly our two rooted triad traversals. With `k` distinct notes and a specified root, there are `(k−1)!` orderings. If the first note is free and every linear listing is counted separately, the number is `k!`.

One can instead regard cyclic rotations of a distinct-note listing as equivalent, then choose the unique rotation beginning at the specified root. This produces the same rooted count. It does not identify reversal: the two triad traversals remain different. Further identifications by transposition or inversion are separate operations and require their own orbit calculation.

The collection of orderings above a fixed content set is called its fiber. Here that means a finite set: two points for our rooted triad, twenty-four for five notes, and 5,040 for eight. If the display uses transposition/inversion content classes, a representative collection must be chosen to draw these rooted orderings. The content class does not itself provide a distinguished first note.

This organization keeps two questions accessible at once. We can move to a different collection, or remain with the collection and select a different ordering. The construction does not require every mathematical neighbor to be an appealing musical continuation. It supplies candidates and named operations whose usefulness can be investigated.

## Two Fourier transforms of order-related information

There are two signals worth keeping separate. The order signal assigns a complex point on the pitch-class circle to each successive entry of the tuple. Its discrete Fourier transform is taken across the sequence positions. In the paper these coefficients are written `Y`. Keeping the full complex transform recovers the signal, and therefore the ordered pitch classes.

The gap signal instead assigns a complex point to each directed modular gap. Its transform is written `G`. It describes the step sequence, whose reconstruction also needs the root. Content Fourier coefficients, written `X`, come from yet another signal: the indicator function across pitch classes. For the two triad traversals, `X` agrees, while the complete order signals differ.

These transforms are coordinate systems for different inputs. A peak in one cannot be interpreted by silently borrowing the meaning of a peak in another. The paper's general gap-period theorem concerns support in a particular subgroup of Fourier indices. Having a few nonzero coefficients somewhere is not enough to establish a repeated gap pattern. That general theorem remains outside the current Lean release.

Even a simpler summary deserves care. The forward triad's three gaps all differ, so their histogram entropy is maximal for three samples. The reverse gaps also all differ and have the same entropy. This measures gap diversity, not melodic smoothness, emotional tension, or human learnability. Those interpretations would require additional definitions and evidence.

## What the explorer shows

The [layered explorer](https://shapeofmusic.org/visualizations/layered-bundle-explorer/) gives the finite construction a visible form. Content nodes lead to local displays of orderings. Edges within a displayed fiber connect selected rooted orderings that differ by an adjacent swap among the remaining positions. A path records those swaps; it need not minimize registral voice motion or sound like a gradual change.

The published data contain 14,262 orderings across 216 fibers. The included fibers through cardinality five are enumerated; larger fibers are sampled at no more than 96 orderings each. Thus an eight-note fiber display contains a selection from its 5,040 possible rooted orders. Its visible graph is a sampled adjacent-swap graph, not the complete ordering space.

The drawing also reduces dimensions. Screen distance can differ from the distance used to construct a layout, and sampling can omit paths. Selecting and inspecting an example is a reasonable use of the display. Treating its appearance as proof of perceptual similarity or complete topology would exceed what has been checked.

The continuous ambient space developed later is a further construction. Finite orderings embed as particular points in complex coordinate spaces. The resulting vector fibers contain many points that are not valid discrete orderings. A continuous path therefore needs an explicit realization rule before it becomes a sequence of playable pitch patterns. The chosen symplectic structure in Part III belongs to that ambient model; it does not turn the finite fiber itself into a smooth manifold.

## A first task for an instrument

A proposed experiment begins with an original short phrase. Preserve its timing, register, articulation, and event identities, then offer a small set of explicitly defined pitch-order operations. Ask the performer to make a chosen change, recover the original, and repeat the change. The triad gives a minimal demonstration; a richer phrase tests whether the control remains useful when repetitions and expression matter.

An operation that permutes pitch assignments across event slots should specify whether duration stays with the slot or travels with the note. Those alternatives can produce different results. The full event record makes such choices inspectable and reversible. A reduced pitch-class view can help select the operation without becoming the sole archive of the phrase.

The [research agenda](https://shapeofmusic.org/research/) proposes comparing this control with a familiar workflow and gathering judgments of recognition, unintended changes, and practical usefulness. These experiments have not established a benefit yet. Exact reconstruction supplies one necessary assurance: the model can recover what it claims to retain. Whether the performer can use that assurance to develop an idea remains a question for the instrument and its player.

A reversible representation lets us specify what a musical operation changes and what it preserves.

<div class="source-notes">

## Sources and further reading

- [GAMUT proof manifest](https://shapeofmusic.org/research/library/proof-manifest/): root-and-gap reconstruction, finite fiber counts, Fourier identities, and layered injectivity.
- [Current mathematical paper](https://shapeofmusic.org/papers/layered-symplectic-proof-paper/): order and gap conventions, the finite seed, and the chosen ambient geometry.
- [Manuscript review and dataset checks](https://shapeofmusic.org/research/library/manuscript-review/): scope and limitations of the published ordering data.
- Robert Morris, *Composition with Pitch-Classes* (Yale University Press, 1987): further reading on ordered pitch-class structures.
- [Musical-utility study protocol](https://shapeofmusic.org/research/library/study-protocol/): proposed phrase experiments and evidence requirements.

</div>
