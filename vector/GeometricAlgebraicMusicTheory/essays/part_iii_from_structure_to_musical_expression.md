# Part III. From Structure to Musical Expression

Source: https://shapeofmusic.org/essays/part-iii-why-the-space-wants-a-symplectic-form/ (GAMUT essay by Jason St George, as published)

## From a description to an action

Consider the little phrase that has accompanied us through the first two essays: C–E–G. We can identify its pitch collection, reverse its order, or move it to another starting pitch. Each description exposes a different relationship. Each operation gives the player something different to hear.

A useful interface would make those differences available without requiring a fresh explanation at every gesture. A player might retain the pacing of a phrase while changing its pitches, or preserve its directed intervals while transposing it. The musical question concerns the result and the player's ability to shape it. The mathematical question concerns what the operation actually does.

GAMUT now has a checked foundation for part of that second question. Its Lean library proves reconstruction and counting results for rooted cyclic patterns of distinct pitch classes. Its reviewed manuscripts then develop a continuous geometric setting around those finite patterns. The relationship between these achievements matters: a proof about a representation gives a designer a reliable contract, while a geometric model offers choices about how transformations might be organized. An instrument still has to make those choices audible and controllable.

This essay explains what the continuous model adds, and how to bring that addition back to the original musical purpose.

## Two signals, with their phases intact

A pitch-class collection can be written as an indicator: one at each occupied position on the twelve-point circle, zero elsewhere. Its Fourier transform expresses the same indicator through complex coefficients. Each coefficient has a magnitude and a phase. These are modes of a pitch-class pattern, not the acoustic harmonics of a recorded instrument.

The magnitude-only description discussed in Part I is useful precisely because it forgets information. Squared content magnitudes determine the cyclic autocorrelation, and conversely. They do not generally identify the original collection. Keeping the full complex content transform keeps the information needed to recover its indicator.

Order requires a different signal. For each successive position in the phrase, record the visited pitch class as a point on the complex unit circle, then transform that indexed sequence. The full complex order spectrum retains the sequence. Inverse transformation recovers the indexed pitch values, including their starting position. The constant, or DC, coefficient is part of that full spectrum and cannot simply be discarded.

The spectrum of the directed gap word answers another question. It describes the pattern of steps, with the absolute pitch root omitted. Its periodicity information is useful, but it is not interchangeable with the order spectrum. The two encodings have different reconstruction conditions.

Keeping these distinctions gives us complex content coordinates, conventionally called `X`, alongside complex order coordinates, called `Y`. At a fixed cardinality, we can place the musical patterns in a product of complex coordinate spaces. The finite patterns occupy only a constrained subset of that larger space.

That last sentence is the hinge. Describing the room around the patterns is additional mathematical work; most points in that room are not themselves valid twelve-tone phrases.

## What the symplectic choice supplies

A complex coordinate has two real components. Writing it as `z = x + iy` makes the pair visible. On such a plane, the standard oriented area form is `dx ∧ dy`. Combining these forms across the content and order coordinates gives the manuscript's chosen symplectic structure:

```text
ω = (i/2) Σ_j dX_j ∧ dX̄_j + λ (i/2) Σ_l dY_l ∧ dȲ_l,   λ > 0.
```

The positive parameter `λ` sets the relative weight of the order layer. The formula specifies a geometric relationship among coordinate variations. It does not follow merely from the fact that the musical encoding is injective. We choose this structure because it supports a precise account of symmetry and motion in the ambient space.

Where a coefficient is nonzero, it can also be described by its angle and half its squared magnitude. These are the action-angle coordinates used in the paper. At zero magnitude, the angle is undefined; the underlying Cartesian description remains available there. This is a limitation of that coordinate description, not a hole in the entire ambient space.

Why introduce such machinery? A symplectic form lets us define Hamiltonian flows from a chosen function and study which transformations preserve the form. It organizes a class of possible motions. It does not automatically specify which motion should count as a convincing musical development, or which function should measure tension, preference or ease of playing.

Nor does preservation of a symplectic form mean preservation of every distance or every spectral magnitude. Those would be further properties to establish for a particular transformation. Calling the space symplectic provides a precise mathematical commitment, not a general assurance that everything musically valuable remains unchanged.

## Symmetry, and the limits of a continuous path

Pitch transposition acts on Fourier coordinates by coordinated phase rotations. The manuscript extends these discrete transformations to a Hamiltonian circle action. Cyclic reindexing has its own circle extension, while forgetting the starting index of a finite pattern is still a finite cyclic quotient. These are related constructions with different jobs.

Inversion acts differently: it conjugates the content coefficients and conjugates the order coefficients with an index reversal. Under the stipulated form, it is anti-symplectic. The distinction is mathematically exact; it does not rank inversion as a less expressive or less legitimate musical operation.

A continuous extension also introduces possibilities outside the original musical domain. A path starting at a twelve-tone pattern need not pass through another such pattern at every instant. An interface that draws such a path and then plays notes must explain how it turns ambient coordinates into output. Selecting nearby valid patterns, quantizing values or using a richer pitch domain are different design choices. Each changes what a listener receives.

The same care applies to the word “fiber.” The finite set of orderings above a chosen content is not a vector space. It can be embedded in an ambient vector fiber, but the extra points and paths belong to the extension. Across different cardinalities, the manuscript uses a disjoint family of spaces. The explorer's add/remove edges are separately defined; they do not supply an automatic continuous passage from a three-note ambient component to a four-note one.

These distinctions help an instrument designer identify the decisions still needed between a geometric picture and a sound.

## A proof release changes the questions we can ask

The first Lean release checks ten discrete contracts through a manifest of 256 required exports. Among its results are directed-gap reconstruction with closure and distinctness conditions, ordering counts, finite complex Wiener–Khinchin, full order-spectrum reconstruction and layered injectivity. It also certifies the established twelve-tone census of 223 nonempty transposition/inversion classes and exact examples of information lost by particular summaries.

This is a substantial kind of accountability. We can identify the assumptions under which a representation reconstructs its input, rather than rely on a persuasive figure or a handful of examples. The general gap-period/support theorem and the higher symplectic arguments remain manuscript results outside this Lean release. The numerical visualizer, historical labels and performance outcomes have their own evidence requirements.

The proof domain also establishes a practical boundary for the next instrument: a performance can repeat a pitch, sustain several voices, change register and vary articulation. These features are not supplied by proving a theorem about distinct-note cyclic tuples. A richer performance record must retain them, with pitch-class coordinates available as derived views.

The appropriate next question is therefore specific: which verified relationships are useful within a musical task, and what additional information must the interface keep around them?

## Put a small relationship under the player's control

The proposed first instrument begins with phrase transformation. Capture or enter a phrase, keep the original available, choose a small operation, audition the result, and reverse the change. With C–E–G, changing to C–G–E could preserve the event slots' timing while altering pitch assignment. Transposition could preserve directed pitch-class intervals while moving the phrase. Neither operation specifies the entire expressive result.

That is a design scenario, not a description of an already tested GAMUT instrument. The pilot would need a performer, a task and a comparison with a familiar workflow. It should ask whether the player can make the intended variation, understand an unexpected result and return to a preferred version. Latency, learnability and expressive agency require separate attention. An impressive output alone would not establish that the performer gained useful control.

The project's source studies of Coltrane and Bruckner enlarge this question. They propose examining recognizable material through change, the independence of voices, and the effect of returning after a longer span. Those are reasons to preserve timing, context and memory. Direct listening and score-specific analysis remain ahead; the composers' work should help test the model's adequacy rather than serve as decoration for it.

Personal gesture and timbre control, followed by tools for form and memory, are later possibilities. They should develop from what the first musical experiment teaches. A simpler interface may prove more useful than a more elaborate geometric display. That would be information for the research, not a reason to redefine success.

The original ambition survives this discipline. We want a player to carry a conceived musical relationship into sound with more continuity and less unnecessary translation. The mathematical foundation makes some relationships exact. The instrument must make them available to attention, hearing and practice. Bringing those achievements together is the work now beginning.

A musical map earns its place when the relationships it makes precise become useful decisions for a player.

<div class="source-notes">

## Sources and next reading

- The [reviewed September proof manuscript](https://shapeofmusic.org/papers/layered-symplectic-proof-paper/) states the ambient construction, symmetry actions and reduction hypotheses. Its chosen geometry is distinct from the finite musical seed.
- The [Lean proof manifest](https://shapeofmusic.org/research/library/proof-manifest/) and [trust record](https://shapeofmusic.org/research/library/trust-and-validation/) specify the machine-checked release.
- The [research overview](https://shapeofmusic.org/research/) links the musical-utility agenda, Coltrane/Bruckner dossiers and performer-study protocol. The [technical companion](https://shapeofmusic.org/essays/part-iv-why-structure-is-distance/) develops the reconstruction and measurement distinctions.
- The [interactive explorer](https://shapeofmusic.org/visualizations/layered-bundle-explorer/) displays projected and sampled relationships. Its screen distances and apparent topology should be read with the stated limitations.

</div>
