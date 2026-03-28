# Part II. Attaching Order to Content

*How musical space becomes a fiber bundle*

> Part II takes the step that Part I only prepared. Once pitch content has been compressed into a symmetry-reduced base space, the missing question is not whether order matters, but how order can be attached without undoing the compression. The answer is a layered construction: content below, order above, and a total object that behaves less like a flat catalog than a bundle of local combinatorial worlds.

## The second question

Suppose two musicians are given exactly the same five notes. One arranges them as a smooth ascending scalar figure. The other leaps through them in alternating thirds, breaking the line into a lattice of skips and returns. In the most literal sense, the two passages contain the same material. In the most immediate musical sense, they do not inhabit the same world.

This is the second question that emerges the moment the first one is answered. Part I asked what notes are present and showed that pitch content can be organized by cyclic fingerprints on the pitch-class circle. But once content has been reduced, another form of structure appears in relief. A set tells us membership. It does not tell us itinerary. It tells us what belongs to the object. It does not yet tell us how the object moves through itself.

The distinction is familiar in practice even when it is not named. A scale is not only a collection of scale degrees; it is also a way of passing from one degree to another. A chord is not only an unordered sonority; it can also be a broken figure, a voicing pattern, an arpeggiated route, a melodic cell distributed over time. Even the same twelve-tone row can become palpably different when its order is segmented, cycled, inverted in part, or rethreaded through a different registral or rhythmic design. Once one notices this, the inadequacy of a content-only geometry becomes impossible to ignore.

The problem is not that content theory is wrong. The problem is that it is only one layer. To add order honestly, however, one must avoid a common mistake. One must not simply throw all orderings back into the same pot and call the result a richer space. That move would destroy the very compression that made the first map intelligible. The real task is subtler: content must remain the base layer, while order is attached locally as a further structure above each content point.

## Why order does not belong in the base layer

It is tempting to think that the easiest solution is simply to replace each pitch-class set with the list of its notes in order. But that would confuse two different kinds of identity. Content answers a symmetry-reduced question: which pitch classes are present up to transposition and inversion? Order answers a different question: in what sequence or cyclic traversal is that content realized? If both are collapsed into a single undifferentiated coordinate system, the first layer loses its explanatory power. We no longer see what different orderings have in common, and we no longer know which differences belong to content and which belong to traversal.

A useful analogy is a city map. One layer gives the streets and blocks. Another gives the routes travelers may take. No one mistakes the street grid for the collection of all possible itineraries; nor would anyone understand traffic by erasing the grid and keeping only route histories. The route space must be attached to the map, not substituted for it.

Musical order behaves in the same way. There is first a content point: some abstract pitch-class object after the relevant symmetries have been folded out. Above that point sit many possible ordered realizations. Some are almost trivial neighbors, differing only by a local swap. Others are remote from one another and require a much larger rethreading of the pattern. The right question is therefore not “What is the order of this set?” but “What is the local order-space associated with this content class?” That wording already hints at the geometry to come.

## Rooting the cycle

Before building that local order-space, one must remove a final nuisance symmetry. Many ordered patterns are cyclic rather than linear: one can start reading them at different points on the cycle and still encounter the same circular object. If this is ignored, one and the same pattern appears many times for no musically substantial reason.

The standard cure is to root the cycle. Choose a distinguished starting point - often the smallest pitch class after normalization, or some other chosen anchor - and read the cycle from there. Once a root is fixed, cyclic rotation is no longer treated as a meaningful difference. The gain is not merely clerical. Rooting turns a redundant family of circular readings into a manageable set of orderings whose remaining differences are musically substantial.

This is the first place where the geometry of the fiber becomes visible. We are not cataloging arbitrary strings of notes. We are studying rooted cyclic traversals of a fixed content object. A rooted traversal remembers enough order to matter while modding out the trivial equivalence of “the same cycle read from a different starting point.” In practical terms, the fiber over a content class becomes smaller, cleaner, and more interpretable.

## Gap words and interval cycles

Once a cyclic ordering is rooted, it acquires an especially revealing summary: the cyclic gap word. Read around the ordered pattern and record the successive pitch-class intervals from each note to the next, taken modulo 12. The result is a circular word of step sizes. If the pattern is [p_0, p_1, ..., p_{k-1}], then its gap word records p_1 - p_0, p_2 - p_1, and so on, returning at the end to p_0 - p_{k-1} modulo 12.

This is where Slonimsky suddenly becomes mathematically crisp. His interval cycles are not vague stylistic habits but periodic gap structures. A pattern built on repeated minor thirds corresponds to a recurrent gap word dominated by the value 3. A whole-tone cycle gives repeated 2s. Interpolated patterns, infra-polations, and other ornamented constructions appear as deformations of a simpler cyclic backbone: the cycle remains legible, but the gap word acquires extra local variation.

The advantage of this description is that it preserves order without abandoning cyclic structure. A set says what notes are occupied on the clock. A gap word says how one travels from occupied point to occupied point. The first is static membership. The second is organized motion. And because the gap word is itself a cyclic object, it is ready for the same kinds of combinatorial and Fourier analysis that proved fruitful for content.

At this point one can already sense the two-layer picture sharpening. Content classes form the lower geography. Gap structures, rooted traversals, and their deformations form a local upper geography attached to each lower point.

## The local geometry of permutations

Orderings do not merely differ; they differ by more or less. That simple observation is what turns the local order-space from a bag into a geometry. If one ordering can be reached from another by a single adjacent swap, they feel close. If it takes many such swaps to pass from one to the other, they feel more distant. This is the intuition behind permutation metrics such as Kendall tau, which counts how many adjacent exchanges are needed to transform one ordering into another.

The importance of such a metric is philosophical as much as technical. It says that local differences in order are not all equal. A tiny rerouting of a pattern should not be treated as remote from the original. Conversely, a radical rethreading should not be plotted as a near neighbor merely because the underlying content is unchanged. The order-space needs its own notion of small displacement.

Combinatorially, the picture is elegant. The set of all orderings of a fixed list can be organized by adjacent swaps; each ordering is a vertex, and an edge is drawn when one adjacent transposition converts one ordering into another. In the background lurks the permutohedral idea: permutations are not only countable; they have a natural neighborhood graph. For musical purposes, one does not need to insist on the whole polytope in full generality. What matters is the insight it offers. Orderings can be navigated locally.

This gives the fiber its first honest geometry. It is no longer merely the set of all possible traversals. It is a space in which one ordering sits near another for concrete, musically intelligible reasons.

## The fiber over a content class

We can now state the structural move that Part I was pointing toward. Let c be a content class - some symmetry-reduced pitch object in the base space. The fiber over c is the set of admissible rooted cyclic orderings of that content. In schematic form one may write

```text
F_c = { rooted cyclic orderings of the content class c }.
```

The sentence matters more than the symbolism. Each point in the base does not stand alone. It carries above it a local fringe of internal possibilities: ways of reading, traversing, and articulating that same underlying content. Two content classes may be near in the base because they share similar interval fingerprints. Two orderings in the same fiber may be near because one is a small rerouting of the other. These are different kinds of nearness, and the total space must preserve both.

This is why the emerging object begins to resemble a bundle. In a fiber bundle, one has a base space together with a fiber attached to each base point, and the total object is built by assembling those local fibers over the whole base. The musical construction is not a fiber bundle in every strict differential-topological detail from the outset, because singular symmetries and changing cardinalities complicate the story. But as a guiding architecture, the bundle picture is exactly right. Content lies below. Order hangs above. The total space is the union of these local attachments.

This bundle language does more than provide a pretty metaphor. It disciplines the theory. It prevents us from confusing similarity of content with similarity of order. It lets us talk about motion inside a fiber separately from motion along the base. And it prepares the way for a later dynamics in which both kinds of displacement matter but need not be measured by the same ruler.

## Measuring likeness within the fiber

A local order-space still needs coordinates robust enough to support visualization. Adjacent-swap distance provides one piece of the metric, but it is not the whole story. Two orderings might lie the same number of swaps away from a reference ordering while producing very different step patterns. The fiber therefore benefits from an order-sensitive feature map built from the pattern itself.

The simplest such features are summaries of the gap word: a histogram of step sizes, counts of successive step pairs, perhaps an entropy-like measure of how regular or irregular the traversal is. These do not replace the ordering; they describe aspects of it that remain musically legible. A pattern with repeated equal steps, a pattern that alternates long and short intervals, and a pattern that meanders irregularly should not collapse into one local neighborhood merely because they contain the same notes.

A practical local metric therefore blends two ingredients: the cost of permuting one ordering into another and the difference between their order-sensitive summaries. In schematic form one may write

```text
d_F(pi, rho)^2 = alpha d_K(pi, rho)^2 + beta || f(pi) - f(rho) ||^2.
```

Here d_K is a permutation distance such as Kendall tau, and f records whatever order-sensitive features one has chosen to preserve. The specific weights alpha and beta are not sacred. What matters is the principle. The geometry of the fiber should preserve musically meaningful nearness rather than merely counting reorderings in the abstract.

This is one of the decisive interpretive gains of the layered model. It gives an explicit answer to the question of why some orderings of the same content feel like variants of one another while others feel like genuinely different pattern-worlds. They inhabit the same fiber but not the same neighborhood.

## From exact combinatorics to visible geometry

At this point the exact object is already present in principle: a base of content classes, fibers of rooted orderings, and metrics on both levels. But human beings do not think directly in high-dimensional feature spaces or large neighborhood graphs. To make the space visible, one needs a controlled projection.

This is where methods such as multidimensional scaling and diffusion maps enter. Their role is not to define the geometry but to render it. One first builds the exact or approximate distance data that expresses musical nearness. One then asks for a low-dimensional configuration of points whose visible distances preserve that deeper structure as faithfully as possible. The 3D and 4D bundle renderings arise at precisely this stage: they are shadows of a richer exact object, not the object itself.

This distinction between model and rendering is essential. A plot can be seductive and misleading at once. A cluster that looks important may be only a projection artifact. A loop that appears smooth in two dimensions may hide combinatorial singularities. The right discipline is therefore to treat the graph, metric, and quotient relations as primary, and the visible embedding as explanatory. The rendering is a map of the geometry, not a substitute for it.

Even so, the visual gain is enormous. A 3D tangent-plane attachment lets the eye see each content point surrounded by a small local halo of orderings. A 4D direct-sum construction, when rotated and projected, separates base motion from fiber motion even more cleanly. The first is often easier to read in a static image. The second is often closer to the mathematics. Together they teach the same lesson: content and order belong together, but they do not live in the same coordinates.

## Where symmetry pinches the bundle

No honest account of the total object can ignore its singular points. Some content classes have exceptional symmetry. The diminished seventh chord, for example, folds onto itself under nontrivial transpositions; the whole-tone collection does something similar in its own way. These are not generic points in the base. They are hubs where the quotient has extra isotropy, and the local geometry behaves differently.

The same phenomenon reappears in the fibers. Certain orderings are stabilized by residual symmetries or by repeated local structures that make distinct-looking readings partially equivalent. In such places the fiber does not behave like a generic smooth fringe. It pinches, folds, or acquires reduced local dimension. What looked like a bundle in the broad sense reveals itself, more precisely, as a stratified bundle-like object with singular orbit types.

This is not a flaw in the model. It is one of the things the model is trying to explain. Symmetry-rich musical objects really do behave like landmarks. They gather pathways. They collapse distinctions. They serve as points of unusual equivalence in the space. Any geometry that forced them to look generic would be less truthful than one that lets the singularities remain visible.

## A space of positions is not yet a space of motion

By the end of this second stage, the map is far richer than the one we began with. We have a content base shaped by cyclic fingerprints and quotient symmetries. We have local fibers of rooted orderings organized by permutation and pattern metrics. We have a total object that can be approximated visually as a bundle-like 3D or 4D construction. And we have a principled account of why singular landmarks arise where symmetry becomes unusually strong.

But however satisfying that architecture may be, it is still static. It tells us where musical objects live and how they cluster. It does not yet tell us what lawful motion through the space should mean. A shortest path in a metric space is not the same thing as a musically privileged flow. A local rerouting inside a fiber is not yet a dynamics. The map is now much more than a catalog. It is not yet a mechanics.

That final turn requires a new language. The moment the layered object is lifted into Fourier coordinates, phase begins to matter alongside magnitude, and the geometry begins to resemble a true phase space rather than a mere arrangement of points. Only then does the theory acquire the resources to speak not just about similarity and adjacency, but about conserved structure, Hamiltonian-type symmetries, and lawful motion on a stratified musical space.

Once content and order are separated and reattached, the remaining question is no longer where musical objects live, but how they move.
