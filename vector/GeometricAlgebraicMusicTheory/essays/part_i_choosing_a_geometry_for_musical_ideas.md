# Part I. Choosing a Geometry for Musical Ideas

Source: https://shapeofmusic.org/essays/part-i-why-music-wants-a-geometry/ (GAMUT essay by Jason St George, as published)

## Begin with something to play

A musician has a short idea and wants to change it without losing the feature that made it worth keeping. Perhaps the notes should move into another register while the rhythm remains. Perhaps a three-note figure should return in another order. Perhaps the performer wants to explore several continuations and recover the original immediately. These are practical questions about memory, transformation, and control.

GAMUT asks whether mathematical representations can make some of those relationships easier to inspect and eventually to play. The ambition is an instrument through which a musician can develop an idea while it remains vivid. The present project supplies a discrete mathematical foundation and exploratory displays. Turning those into useful controls is the next research task, with success to be established through making and listening.

A geometry can help by assigning objects coordinates and making selected relationships explicit. Its value depends on the choice of objects and relationships. A distance based on pitch displacement answers a different question from one based on rhythmic difference. Neither automatically measures how similar two performances will seem. Before drawing the map, we need to decide what it is a map of.

## Three notes, several descriptions

Take C, E, and G. In one passage they might sound together; in another they might arrive successively. They can occupy a narrow register or span several octaves. They can be quiet, accented, repeated, sustained, or played by different instruments. Even this small amount of pitch material supports distinctions a set of three names cannot record.

For a first model, choose twelve equally spaced pitch classes and write C as 0, C-sharp as 1, and so on. E becomes 4 and G becomes 7. Identifying pitches separated by octaves gives the collection `{0, 4, 7}`. The arithmetic wraps around after twelve: adding one to 11 gives 0.

This reduction is useful when the question concerns pitch-class membership. It discards register, tuning detail beyond the chosen classes, onset, duration, articulation, and instrumentation. Taking a set also discards repetitions: C–E–C–G and C–E–G have the same members. A rest does not appear. These omissions are consequential, so a future performance tool should retain the original events alongside any reduced view.

The clock picture expresses the arithmetic clearly. Its twelve positions are pitch classes, not twelve possible musical experiences. Other tuning systems and other questions require different choices. The model does not establish octave equivalence as a universal law of listening; it uses it as an explicit identification.

## Choosing which differences to set aside

Transposing `{0, 4, 7}` upward by two gives `{2, 6, 9}`. If our task concerns the relationship among notes independently of their starting pitch class, we can place these in the same class. This is a quotient: a collection of objects grouped by a declared equivalence relation.

We may also identify inversion, the operation that reflects pitch classes and can then transpose the result. That choice puts major and minor triads in the same transposition/inversion class. It does not assert that a major and a minor triad are interchangeable in a passage. A harmonic function, bass note, melodic context, or performer's intention may require keeping them apart. The quotient answers a particular classification question.

There are 4,096 subsets of twelve pitch classes. Under transposition and inversion they form 224 classes, or 223 when the empty set is excluded. The familiar set-class catalogue gives names to these types. GAMUT's Lean release verifies the count independently of any claim about how listeners categorize them. The proof concerns the declared finite equivalence relation; it does not certify every historical name attached to a node in the interface.

Symmetry explains why equivalence classes contain different numbers of concrete sets. Transposing the whole-tone collection by two semitones preserves it. Most sets have fewer preserving transpositions. Counting these transformations tells us something exact about the collection. Whether a symmetry becomes prominent in performance also depends on how the notes are presented.

## Comparing collections by overlap

Once collections have been named, we can ask a more specific comparative question: how many notes does a collection share with a shifted copy of itself? For every shift, count the overlap. This produces its cyclic autocorrelation.

Write `χ_S(n)` as 1 when pitch class `n` belongs to the set `S`, and 0 otherwise. Then

```text
A_S(τ) = Σ_n χ_S(n) χ_S(n + τ)
```

where all positions and shifts are taken modulo twelve. At shift zero, the answer is the number of notes. At other shifts, it counts directed pairs separated by that interval. For `{0, 4, 7}`, shift four finds the pair from 0 to 4. Shift three finds the pair from 4 to 7. The calculation considers all pairs in the set, regardless of any order in which a performer might play them.

This is closely related to an interval vector, with care needed about directed intervals and the counting of the six-semitone interval. It is useful because it summarizes a clearly stated relationship. Collections can be compared through these overlap profiles, provided the comparison rule is also stated. No particular distance between profiles comes with a guarantee of perceptual similarity.

![Cyclic overlap and autocorrelation](https://shapeofmusic.org/figures/cyclic-autocorrelation.png)

## What the Fourier transform preserves

The same indicator function can be expressed using the discrete Fourier transform. Instead of listing its values at pitch positions, we give its complex coefficients in a basis of cyclic modes. Keeping all those coefficients preserves the indicator: an inverse transform recovers the original set.

Taking only the squared magnitudes of the coefficients gives the power spectrum. The finite autocorrelation identity relates that spectrum to the overlap profile by another Fourier transform. Thus the full autocorrelation and the full power spectrum contain equivalent information, even though they look different on a page.

The distinction between complex coefficients and their powers matters. A complex coefficient includes phase; its squared magnitude does not. A transformation of coordinates can be reversible while a summary calculated from those coordinates loses information. Calling both of them a spectral representation should not conceal that difference.

In particular, Fourier power does not uniquely identify a pitch-class set, even after transposition and inversion have been set aside. That limitation has a small, explicit example.

## Two collections with the same interval counts

Consider `{0, 1, 4, 6}` and `{0, 1, 3, 7}`. Each contains one unordered pair of each interval class from one through six. Each therefore has the directed autocorrelation

```text
[4, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1].
```

Yet no transposition or inversion carries one set onto the other. Such sets are called homometric, and this non-equivalent pair is Z-related in pitch-class terminology. Both their matching autocorrelations and their inequivalence are checked examples in the [Lean proof manifest](https://shapeofmusic.org/research/library/proof-manifest/).

The example identifies exactly what the summary cannot decide. Counting pairwise intervals forgets enough about their arrangement to merge two distinct content classes. Keeping the full complex Fourier coefficients avoids this particular loss. It still does not restore rhythm or instrumentation, because those features never entered the indicator function.

This distinction is useful for a musical interface. A search by interval profile could intentionally return both sets as candidates. A tool promising exact recovery of the chosen collection would need to preserve more information. The same summary can be appropriate for discovery and insufficient for reconstruction.

## From content to traversal

Return to C, E, and G. The sequences `(0, 4, 7)` and `(0, 7, 4)` have exactly the same content indicator, autocorrelation, and content Fourier transform. Even a complete representation of their set cannot distinguish these two traversals. To do that, we must add order to the object being represented.

That is a different problem from homometry. Homometric sets differ in membership while sharing a summary. Here the membership itself agrees, and the difference lies in sequencing. Separating the problems lets us select an appropriate representation for each instead of asking one statistic to answer every question.

Part II develops that additional layer through the two triad traversals. The [current paper](https://shapeofmusic.org/papers/layered-symplectic-proof-paper/) gives the mathematical construction, while the [research overview](https://shapeofmusic.org/research/) explains the larger musical agenda. A proposed phrase tool will need richer event information than either layer alone. These small exact models are useful starting points because they let us say what a transformation preserves, before asking whether that transformation helps a musician.

A musical map earns its usefulness through the distinctions it helps someone hear and control.

<div class="source-notes">

## Sources and further reading

- [GAMUT proof manifest, F01–F10](https://shapeofmusic.org/research/library/proof-manifest/): discrete representation contracts, the twelve-tone census, and the tetrachord example. These proofs do not establish musical utility.
- [Layered symplectic musical space](https://shapeofmusic.org/papers/layered-symplectic-proof-paper/): definitions, conventions, and the distinction between complete coordinates and invariant summaries.
- Allen Forte, *The Structure of Atonal Music* (Yale University Press, 1973), and John Rahn, *Basic Atonal Theory* (Longman, 1980): pitch-class sets and equivalence operations.
- Emmanuel Amiot, *Music Through Fourier Space* (Springer, 2016): further reading on Fourier methods in music theory.

</div>
