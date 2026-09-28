# Part IV. What Musical Representations Preserve

Source: https://shapeofmusic.org/essays/part-iv-why-structure-is-distance/ (GAMUT essay by Jason St George, as published)

This technical companion develops the exact distinctions behind the [three introductory essays](https://shapeofmusic.org/essays/). For the completed Lean milestone and the proposed musical experiments, see the [research overview](https://shapeofmusic.org/research/).

## What the representations remember

The first three essays separate pitch content, traversal order, and an ambient geometry in Fourier coordinates. These representations overlap, but they retain different information. The phrase “metric ladder” is useful as a historical organizing image only if we specify the maps. There is no general four-rung chain in which each item reconstructs the one before it.

A labeled distance matrix determines the multiset of all pairwise distances. Given a chosen traversal, it also determines that traversal's unsigned step sequence. Forgetting the sequence's reading order gives a **step multiset**, not the all-pairs multiset. For example, the traversals `(0,1,3,6)` and `(0,1,4,6)` in twelve tones have the same directed gap multiset `[1,2,3,6]`. Their pairwise circular-distance multisets are `[1,2,3,3,5,6]` and `[1,2,3,4,5,6]`. The intervening steps must be added in the right order to recover nonadjacent differences.

Directed gaps are residues `p_(m+1) − p_m` modulo 12. They retain orientation; an unsigned circular distance does not. A root and a supplied gap word reconstruct a distinct-note cyclic pattern with exactly those gaps if and only if the gaps sum to zero modulo 12 and the partial sums before the final edge are distinct. Merely obtaining distinct pitches does not ensure that the supplied final gap closes the cycle: root 0 and gaps `(1,1)` produce `(0,1)`, whose actual gaps are `(1,11)`. Without a root, indexed directed gaps determine a traversal up to transposition. Forgetting its starting index is a further cyclic quotient.

## Content and its Fourier image

The directed autocorrelation `A_S(t)` counts ordered pairs with difference `t`, including zero difference. Its twelve bins are determined by the squared moduli of the full content Fourier transform, and conversely, by finite Wiener–Khinchin. This is an exact reconstruction of the autocorrelation, not of the original set.

For twelve-tone content, let `IV(d)` count unordered distinct pairs at circular distance `d`, for `d=1,…,6`. Then `A(0)=|S|`, `A(d)=A(12-d)=IV(d)` for `d<6`, and `A(6)=2 IV(6)`. The six-bin ordered folded histogram is `F=2 IV`. RMCP retains the legacy name `cyclic_autocorrelation` for `F`; the thesis's twelve-point Fourier theorem applies to `A`. Cardinality and the interval vector supply the exact adapter.

Homometric sets have equal directed autocorrelations. This includes equal sets and transposition/inversion equivalents. **Z-related** sets additionally fail transposition/inversion equivalence. The familiar all-interval tetrachords `{0,1,4,6}` and `{0,1,3,7}` are Z-related: both have interval vector `(1,1,1,1,1,1)`. Their displayed ascending gap words are `(1,3,2,6)` and `(1,2,4,5)`. RMCP's function named `homometric` tests this nontrivial Z-relatedness condition for compatibility.

Content also forgets different traversals of the *same* set. That loss is separate from nontrivial homometry. For a chosen content representative of size `k` and a fixed root in it, there are `(k−1)!` orderings, equivalently cyclic orders before any additional quotient by the content stabilizer. All unrestricted linear readings number `k!`.

## Symmetry is derived information

A metric determines its automorphism group: the permutations preserving every distance. The group does not generally reconstruct the metric. Scaling every distance by a positive constant leaves the group unchanged. Its order retains still less information.

Transpositions and inversions preserving a pitch set induce metric automorphisms of that set, but these ambient symmetries must be distinguished from the full metric automorphism group. The explorer's node-size statistic counts preserving **transpositions**. For the whole-tone collection this count is six; including preserving inversions would give twelve ambient transformations.

The unreduced cyclic action on distinct-note ordered patterns is free. After quotienting by transposition, its residual stabilizer instead equals the periods of the directed gap word. Thus `(0,4,8)` has trivial unreduced stabilizer and full residual cyclic stabilizer after transposition reduction. Cardinality grading is another separate matter: the disjoint union of ambient spaces has no attachments between its open-and-closed components. The add/remove graph is a separately defined combinatorial object.

## Encodings and measurements

RMCP encodes candidate objects in redundant representations, including exact squared distances over the golden-ratio integers, graph data, and symmetry generators. These can be checked against one another by the implementation. That constructive program motivates a comparison with GAMUT, but does not invert every information-losing representation or prove that an unfamiliar listener can learn the protocol.

The explorer scores the published **14,262 orderings in 216 fibers**, using enumeration for smaller fibers and sampling for larger ones. This is not every traversal of every class in the 223-class content universe. Sampling retains some adjacent-swap edges but carries no theorem preserving full fiber topology.

Prefix/suffix grammar compression and shuffle-corrected lift are operational statistics. They do not certify semantic understanding or musical predictability. A constant gap word is unchanged by shuffling, which explains why an order-dependent comparison may give zero lift. Step entropy measures histogram diversity: constant steps of size 1 and size 5 both have zero entropy despite their different circular lengths. Claims about smoothness, learning, or perception need separate definitions and validation.

Discovery markers similarly report detector responses, not intentionality. The legacy `crc32_collision` key includes repeated-window checksum groups; the `collision` detail distinguishes different contents sharing a checksum. Repetition and checksum-group detectors can respond to the same event, so their agreement is not automatically independent evidence. Per-offset checksum estimates under an independent uniform-bit model do not establish scanner-wide false-positive rates after searching many offsets, streams, and hypotheses.

The exact positive claim is substantial: full complex order Fourier coordinates reconstruct the ordered pattern, and the layered embedding is injective before quotienting. The chosen ambient coordinates admit the stated symplectic structure and symmetries. Whether this geometry improves a musical task over simpler representations remains an empirical question.

The useful question is what each representation remembers, and what can be reconstructed from it.

<div class="source-notes">

## Source notes

The current proof manuscript gives the finite Fourier, reconstruction, counting, and conditional geometric statements. Duncan's *Combinatorial Music Theory* (1991), Forte's *The Structure of Atonal Music* (1973), Slonimsky's *Thesaurus* (1947), and Amiot's *Music Through Fourier Space* (2016) motivate the terminology; this revision does not certify every historical attribution, catalog label, or coverage claim. See the repository's source-remediation record for the exact corrections and remaining scope limits.

</div>
