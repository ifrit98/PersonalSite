# Part III. Why the Space Wants a Symplectic Form

*From musical configuration to musical dynamics*

> Part III of **The Shape of Musical Possibility**. This publication pass adds figures, pull quotes, references, and journal-style endnotes while preserving the essay register of the series.

## A map is not yet a mechanics

By the end of Part II, the space we had built was already far richer than the one with which we began. Content no longer floated as a mere list of set classes. It occupied a base shaped by cyclic fingerprints and quotient symmetries. Order no longer hid anonymously inside familiar musical categories. It appeared as a local fiber of rooted cyclic traversals attached to each content point.[4] The whole object could be rendered, at least approximately, as a 3D tangent-plane bundle or a 4D direct-sum construction. One could see families, corridors, neighborhoods, and singular landmarks.

And yet something essential was still missing.

> A map is not yet a mechanics. One may have a beautiful atlas of musical objects and still no law of motion.

A map is not yet a mechanics. One may have a beautiful atlas of locations without any account of how motion through that atlas should work. A city map does not, by itself, tell us traffic laws, currents of use, or the forces that make some paths stable and others unstable. Likewise, a geometric arrangement of musical objects does not yet tell us what should count as lawful transformation. It can tell us that two objects are near, but not whether there is a principled way of moving from one to the other. It can tell us that a region is densely connected, but not whether a flow through that region preserves anything worth calling musical structure.

This distinction matters because music is not merely a population of objects. It is a traffic of transformations. A major triad bends toward a minor triad. A diatonic collection leans toward a whole-tone haze. A pattern built from an equal division of the octave acquires interpolated notes and returns altered but recognizable. A row is rethreaded, a cycle inflected, a region revisited. To hear music is not only to hear what is present, but to hear how presence changes.

Metric geometry takes us part of the way. It gives us distance, neighborhood, and local comparison. That is already a great advance over bare classification. But a metric answers the question "how far?" more readily than it answers the question "under what rule?" A shortest path in a similarity space is not automatically a musically privileged path. A visible cluster in a low-dimensional embedding is not, by itself, a dynamics. The next step therefore requires a change in language. We need a geometry in which motion is not an afterthought appended to a static map, but something built into the structure from the start.

The surprise is that this next language has been quietly waiting for us from the beginning. Part I introduced cyclic autocorrelation as a fingerprint of pitch content. Part II separated content from order and then reattached them as base and fiber. Both steps already pointed toward Fourier analysis. And Fourier analysis, once written honestly in complex coordinates, leads very naturally toward phase space.

That is the real subject of Part III: not the importation of an alien mathematics into music, but the recognition that the layered musical object we have been building already wants to be written in a language of amplitudes and phases, and that this language carries with it a natural symplectic form.

## From overlap counts to phase

The hinge of the argument is easy to state.

Cyclic autocorrelation tells us how often a pitch-class set overlaps with itself under cyclic shift. That was Duncan's crucial insight in the first essay.[1] For a set of pitch classes, the resulting overlap profile is a highly economical summary of interval content. One can hear why it matters almost immediately: a diminished seventh, a whole-tone collection, and a major triad all leave different traces when they are rotated against themselves. The trace is not an arbitrary statistic glued onto the object from outside. It is the object's response to motion in the cyclic space where it already lives.

But autocorrelation also has a second life. It is equivalent, by the finite Wiener-Khinchin principle, to the squared magnitudes of the discrete Fourier coefficients of the same object. The first description speaks in the language of overlap. The second speaks in the language of spectral content. These are not rival theories. They are two coordinate systems for the same invariant information.[2]

![Figure 1. Refined spectral content space. A low-dimensional rendering of the content layer after phase-sensitive refinement. The visible clusters are interpretive shadows of a deeper quotient-and-feature geometry rather than the geometry itself.](figure_1_refined_content_space.png)

*Figure 1. Refined spectral content space. A low-dimensional rendering of the content layer after phase-sensitive refinement. The visible clusters are interpretive shadows of a deeper quotient-and-feature geometry rather than the geometry itself.*

That equivalence is more than a technical convenience. It tells us what the first fingerprint remembers and what it forgets. Fourier magnitudes preserve how strongly a set responds to different periodicities around the twelve-point cycle. A strong response in one mode indicates that the set aligns conspicuously with a particular equal division or cyclic pattern. This is why the Fourier language clarifies the special status of collections such as the whole-tone set, the diminished seventh, and the diatonic scale. They are not merely historical categories. They are sets with distinctive spectral saliences.

Yet magnitude is only half of the story. Two different objects can share the same magnitudes while differing in arrangement. This is one way to restate the phenomenon of homometry and Z-relatedness that forced the layered turn at the end of Part I. Magnitude remembers how much of a given periodicity is present. It does not, by itself, fully remember how those periodicities are arranged relative to one another. What is missing is phase.[2]

> Magnitude remembers how much of a periodicity is present. Phase remembers how that periodicity is placed.

Once that point is seen, the logic of the next step becomes difficult to resist. If content already has a natural spectral encoding, and if the incompleteness of that encoding is tied to the loss of phase information, then the honest continuous thickening of the content space should not live in an anonymous Euclidean cloud. It should live in a space of complex coordinates, where amplitude and phase are both present and where symmetries act in the simplest possible way: by rotating phases.

This conclusion becomes even stronger when order enters the picture. Part II introduced rooted cyclic orderings, gap words, interval cycles, and local permutation fibers. Those objects are also cyclic by nature. A rooted pattern is traversed around a loop. Its step sequence has periodicity, regularity, and modulation. Slonimsky's interval-cycle imagination can be re-described very precisely as a theory of patterns whose order signal concentrates strongly in a small family of periodic modes.[3] Once again, Fourier language is not a decoration added later. It is an exact way of speaking about the cyclic structure already present in the musical object.

So the question shifts. We are no longer asking only which pitch classes are present, or which ordering has been chosen. We are asking how to write both layers in a common spectral language.

## Content modes and order modes

For content, the move is straightforward. A pitch-class set can be represented by its indicator function on the twelve-point cycle. Taking the discrete Fourier transform produces a finite list of complex coefficients:

```text
X_j(S) = sum_n chi_S(n) exp(-2 pi i j n / 12).
```

The formula looks heavier than it is. It says only this: for each cyclic mode `j`, measure how strongly the set `S` resonates with a `j`-fold periodicity around the chromatic circle. The coefficient is complex because every periodic component has not only a strength but a phase. Its magnitude tells us how much of that periodicity is present. Its angle tells us how that periodic component is situated on the circle.

For order, there is more than one reasonable encoding, but the basic idea is the same. A rooted cyclic ordering `p = (p_0, ..., p_{k-1})` can be treated as a traversal of points on the pitch-class circle. One may encode the visited pitch classes as complex points `z_m = exp(2 pi i p_m / 12)` on the unit circle and then take a Fourier transform along the order index `m`. This produces coefficients of the form

```text
Y_l(p) = sum_m z_m exp(-2 pi i l m / k).
```

Here the mode `l` measures periodicity in the traversal itself. A pattern that returns every third step, every fourth step, or alternates between a small number of step types will reveal that structure spectrally. If one prefers to work with the gap word rather than the visited points, one can define related coefficients from the successive intervals instead. The exact choice matters less than the principle. The order layer, like the content layer, has natural cyclic modes, and those modes are most honestly written as complex quantities carrying both amplitude and phase.

Once this is done, the base-and-fiber picture from Part II is enriched rather than erased. The content modes `X_j` describe what the pitch collection is, stripped to its cyclic essence. The order modes `Y_l` describe how that collection is traversed. They are not the same variables. But they can live side by side in a common ambient space. The layered object can now be lifted from a purely combinatorial description into a complex coordinate system in which both content and order are simultaneously present.

![Figure 2. Layered symplectic architecture. The content layer and order layer are lifted into a common spectral ambient space. In action-angle coordinates, the resulting form pairs intensity with phase and turns a static map into a geometry of lawful motion.](figure_2_layered_symplectic_architecture.png)

*Figure 2. Layered symplectic architecture. The content layer and order layer are lifted into a common spectral ambient space. In action-angle coordinates, the resulting form pairs intensity with phase and turns a static map into a geometry of lawful motion.*

This is the decisive transition. The object is no longer merely a graph of equivalence classes with locally attached permutation clouds. It is an embedded family of points in a product of complex planes.

## Why the natural completion is symplectic

Once one arrives at a product of complex planes, a certain geometry comes for free.

Every complex coordinate `z = x + i y` carries a canonical oriented area form. In ordinary real coordinates, that form is just `dx ^ dy`. In complex notation, it may be written as `(i/2) dz ^ d z-bar`. This is the standard local building block of symplectic geometry, the geometry that underlies Hamiltonian phase spaces in classical mechanics.[5] One need not yet know much symplectic theory to feel why it belongs here. If our chosen coordinates already come in pairs of intensity and phase, or more abstractly in canonically conjugate directions, then a geometry that preserves those pairings is exactly what we want.

For the layered musical construction, the most natural ambient form is simply the sum of the standard forms on all content modes and all order modes:

```text
omega = (i/2) sum_j dX_j ^ dXbar_j
      + lambda (i/2) sum_l dY_l ^ dYbar_l.
```

The constant `lambda` is just a balancing parameter. It controls how strongly the order layer is weighted relative to the content layer. Conceptually, nothing mysterious is happening. The content coordinates contribute one symplectic block; the order coordinates contribute another; the total form is the direct sum of the two.

What does this buy us? First, it turns the spectral lift into something more than a convenient parametrization. The ambient space is no longer just a place to put points. It has a built-in geometry of motion. Second, it makes precise a fact that has been implicit ever since Part I: amplitudes without phases are incomplete, and phases are not merely labels. They are dynamical coordinates.

The significance becomes even clearer when the complex variables are rewritten in polar form. A nonzero complex coordinate can be written as a magnitude times a phase factor. In the present setting, that means each content mode and each order mode can be described by an intensity variable and an angular variable. On the open locus where no chosen mode vanishes, the symplectic form becomes

```text
omega = sum_j dI_j ^ dtheta_j + lambda sum_l dJ_l ^ dphi_l.
```

This is the action-angle form familiar from Hamiltonian geometry. Read in plain language, it says that each spectral mode splits into a quantity measuring "how much" and a quantity measuring "where in the cycle," and the symplectic form pairs those two kinds of data. Intensity and phase are treated as conjugate variables.

> The symplectic form is not ornamental mathematics pasted onto music. It is the bookkeeping device that preserves amplitude-phase pairings in the spectral lift.

This is the moment at which the musical interpretation sharpens. The content layer ceases to be merely a bag of spectral saliences. It becomes a family of phase-bearing modes. The order layer ceases to be merely a set of local features. It too becomes a family of phase-bearing modes. The full object behaves like a layered phase space: one part remembers what periodic structures are present, the other remembers how traversal organizes them, and the geometry knows how to keep both kinds of information in coordinated relation.

One should resist a crude physical analogy here. The claim is not that a fugue or a jazz solo literally obeys Newton's equations. The claim is subtler and stronger. Once musical content and musical order are encoded spectrally, the correct structure-preserving continuous geometry is symplectic. This is a statement about how best to organize the coordinates, not about reducing art to mechanics.

## Symmetry becomes internal motion

The case for the symplectic picture would already be strong if it only provided a clean ambient geometry. But the argument goes further. The musically basic symmetries act especially well in these coordinates.

Begin with transposition. In ordinary pitch-class terms, transposition adds the same interval to every note. In content spectral coordinates, this does not scramble the modes. It simply rotates the phase of each mode by an amount proportional to the transposition and to the mode number. What looked, in pitch space, like a rigid displacement becomes, in the spectral space, a collection of coordinated phase rotations. Because these rotations preserve the standard symplectic form, the transposition action is not merely geometric. It is Hamiltonian in the usual sense: it is generated by a conserved quantity, or more precisely by a moment-map coordinate built from the mode intensities.

Now consider cyclic reindexing in the order layer. Part II identified rooted cyclic order as the right local quotient. If one shifts the starting point of a rooted traversal around its cycle, the order modes again transform by simple phase factors. So cyclic reindexing acts on the order coordinates exactly as transposition acts on the content coordinates: as a phase rotation preserving the symplectic form. The parallel is beautiful and revealing. What key change is for content, root shift is for order.

![Figure 3. Tangent-plane fiber bundle in 3D. The base records content classes; the small attached local sheets represent sampled order fibers. In the symplectic reading, the visible attachment is only the low-dimensional shadow of a larger spectral phase space.](figure_3_tangent_plane_bundle.png)

*Figure 3. Tangent-plane fiber bundle in 3D. The base records content classes; the small attached local sheets represent sampled order fibers. In the symplectic reading, the visible attachment is only the low-dimensional shadow of a larger spectral phase space.*

Inversion behaves differently, and that difference matters. In the pitch-class world, inversion reflects the cycle. Spectrally, that reflection is represented by complex conjugation together with an index reversal appropriate to the chosen encoding. Complex conjugation reverses the sign of the standard symplectic form. So inversion is not symplectic but anti-symplectic. Again, this is not an arbitrary mathematical flourish. It matches the musical intuition that inversion is a reflection rather than a continuous rotation.

Once these actions are visible, a deeper point emerges. The musically fundamental operations are no longer being described from outside as combinatorial rewritings. They appear as internal motions of the ambient structure itself. Transposition is phase rotation. Cyclic reindexing is phase rotation. Inversion is reflection. The coordinate system is not fighting the music; it is letting the music act in its native form.

This is one of the chief reasons the symplectic completion feels like an arrival rather than an embellishment. The same formalism that preserves amplitude-and-phase pairings also makes the core musical symmetries unusually transparent.

## Why the quotient is stratified

The story would be tidier if every point in the space behaved generically. Music does not permit that luxury.

Some pitch collections possess exceptional symmetry. The diminished seventh chord is the standard example. Transpose it by a minor third and it maps onto itself. The whole-tone collection behaves similarly under its own characteristic shifts. These objects do not sit in the transposition quotient the way a generic triad does. They carry nontrivial stabilizers. In the language of group actions, their orbits are smaller because more transformations fix them.

The same phenomenon can occur in the order layer. Certain cyclic patterns have periodicities or reversal symmetries that make distinct descriptions collapse under the relevant quotient actions. The fiber above such a point is therefore not locally equivalent to the generic fiber. Something pinches, folds, or identifies.

This is why the mathematically honest global object is not a single smooth manifold. It is stratified.[6] One may visualize it as a space built from regions of different regularity stitched together along singular loci. On the generic or free locus, the quotient by transposition or cyclic reindexing behaves smoothly. At symmetry-rich points, one obtains finite quotient singularities of the sort that mathematicians often package as orbifold structure. For an essay, the plainest way to say it is this: the space is smooth where nothing exceptional is being fixed, and folded where symmetry forces several local directions to count as the same.

This is not a pathological nuisance. It is musically correct. Symmetrical objects really are landmarks. They gather pathways and collapse distinctions. They have fewer genuinely different transpositions, fewer genuinely different readings, and more internal self-similarity than generic objects. A model that forced them to look regular would be less faithful than one that allowed the singularities to remain visible.

The symplectic language survives this complication. On each regular stratum, the reduced quotient inherits a genuine symplectic form. Across the singular set, the total object is best understood as a stratified symplectic space: not uniformly smooth, but still organized by compatible symplectic pieces. This is one of the places where the theory acquires real mathematical seriousness. It does not flatten away the exceptional cases; it explains why they are exceptional.

## What the symplectic view buys us

At this point a skeptical reader might ask whether the whole construction has earned more than a refined vocabulary. Why should one care that the spectral thickening is symplectic rather than merely Euclidean, or merely topological, or merely combinatorial?

The first answer is conceptual clarity. A metric space tells us about near and far. A symplectic space tells us about lawful motion. Those are not the same things. The difference between them is precisely the difference between a static similarity map and a phase space. If one wants to talk only about clusters, neighborhoods, and embeddings, a metric may suffice. If one wants to model families of transformations that preserve a deeper structure, one needs more.

The second answer is that symplectic geometry distinguishes two tasks that are often confused in musical discourse. One task is to describe which objects resemble one another. The other is to describe how one object may evolve into another while preserving chosen invariants. These are related, but not interchangeable. A Hamiltonian flow, for example, need not follow a geodesic of any visually convenient metric embedding. It follows the rule generated by a chosen function on phase space. This gives the theory room to express musical preference, tension, or periodic attraction in a principled way rather than by ad hoc nearest-neighbor rules.

Suppose, for instance, that one writes a Hamiltonian favoring strong triadic salience in the content modes and moderate regularity in the order modes. The resulting flow will privilege movements that preserve or exchange those saliences in a controlled manner. A different Hamiltonian might favor equal division of the octave and a periodic gap structure, producing a dynamical bias toward Slonimsky-like interval cycles with limited interpolative drift. In either case the model is not forcing music into one destiny. It is providing a disciplined way to formulate families of musically meaningful motion.

The third answer is conservation. Whenever a group action is Hamiltonian, one obtains associated conserved quantities. In the present setting, transposition symmetry and cyclic reindexing symmetry naturally suggest moment-like quantities built from spectral intensities. This does not mean that actual pieces of music preserve those quantities globally; compositions are not obliged to respect any single model. But it does mean that, inside the model, one can separate changes due to pure symmetry from changes due to genuine deformation. That distinction is already musically valuable. It clarifies the difference between moving the same object to a new key center and altering the object's internal spectral profile.

The fourth answer concerns continuation between discrete and continuous worlds. The musical seed from which we began is discrete: finite sets, finite orderings, finite quotients. Yet many musically illuminating transformations feel continuous: one hears gradual shifts of emphasis, progressive interpolations, rotations through pattern families, or deformations of harmonic quality. A symplectic thickening provides a principled ambient continuum in which the discrete objects sit as distinguished points or lattices. That makes it possible to speak rigorously about continuous families without pretending that the discrete seed has vanished.

The symplectic layer also clarifies why it should not replace the rest of the toolkit. Some analytical or computational tasks will still be better served by multidimensional scaling, diffusion methods, or simplicial chord complexes.[7] The point is not that one formalism abolishes the others. The point is that the symplectic thickening supplies something they do not: a geometry of lawful motion rather than a geometry of adjacency alone.

![Figure 4. A 4D direct-sum projection of the total object. Base motion and fiber motion are separated more cleanly in the higher-dimensional model, even though any static image remains only a projection of the exact combinatorial-and-spectral construction.](figure_4_direct_sum_projection.png)

*Figure 4. A 4D direct-sum projection of the total object. Base motion and fiber motion are separated more cleanly in the higher-dimensional model, even though any static image remains only a projection of the exact combinatorial-and-spectral construction.*

Finally, the symplectic view unifies the entire series. Part I asked how musical content could be given a geometry and found the first answer in cyclic autocorrelation and spectral fingerprints. Part II asked how order could be attached without destroying that geometry and found the answer in local fibers of rooted cyclic traversal. Part III shows that when both layers are lifted into their natural spectral coordinates, the completed object is not merely a better picture. It is the beginning of a dynamics.

## What this does not claim

A good theory earns trust not only by what it includes, but by what it refuses to claim.

This construction is not "the space of all music." It is not a universal ontology of listening, nor a replacement for style, history, analysis, performance, rhythm, timbre, or embodiment. It is a rigorous model for one particular layer of musical organization: pitch content and ordered traversal in a cyclic twelve-tone setting, together with a natural spectral thickening that supports lawful transformations.

Even within pitch, it is selective. It privileges pitch-class organization over register, timbre, and attack. It works at the level of abstract collections and cyclic patterns rather than at the level of full scores or recordings. Voice-leading, if one wishes to include it, must enter either through additional metrics, further coordinates, or a richer bundle structure. Rhythmic organization would require its own cyclic or non-cyclic layers, possibly coupled to the pitch layers but not automatically reducible to them.

Nor should one confuse mathematical naturalness with psychological necessity. A symplectic form may be the right geometry for the chosen spectral coordinates without being the only geometry relevant to human hearing. Listeners also respond to roughness, expectation, memory, stylistic norm, motor gesture, cultural learning, and the stubborn local grain of sound. The point of the present construction is not to eliminate those realities. It is to isolate a layer that can be treated exactly and then to show how unexpectedly rich that exact treatment becomes.

There is also no need to pretend that every useful musical path will be Hamiltonian. Some analytical or compositional tasks will still be better served by combinatorial graphs, shortest-path metrics, diffusion processes, or simplicial models.[7] The symplectic layer should be understood as an enrichment, not an imperial conquest. It adds a geometry of lawful motion to the existing picture. It does not abolish the other kinds of structure we have already built.

These limits are not weaknesses. They are what keep the theory honest.

## Closing synthesis

The series began with a simple unease: the ordinary categories of music theory, however powerful inside their own domains, do not by themselves chart the full universe of twelve-tone possibility. That unease led first to a compression. We folded pitch into pitch class, pitch class into cyclic content, and content into quotient spaces defined by symmetry. We found in cyclic autocorrelation the first serious fingerprint of musical content, and in its Fourier shadow the first hint that the relevant geometry was already spectral.

The second step was to acknowledge that content is not the whole object. Order matters. Traversal matters. The same notes arranged differently do not inhabit the same local world. So we separated content from order, attached rooted cyclic fibers to the content base, and built a bundle-like object in which local permutation geometry could be seen without being confused with global content similarity.

The third step has now completed the ascent. Once content and order are both written in spectral coordinates, the correct continuous thickening is a product of complex mode spaces. And once that space is written honestly, it carries a natural symplectic form. Magnitude and phase become conjugate variables. Transposition and cyclic reindexing become internal phase rotations. Inversion becomes reflection. Symmetry-rich objects become singular strata rather than anomalies. The whole construction passes from the level of atlas to the level of mechanics.

At the beginning of the series, music wanted a geometry. By the end of Part III, that geometry wants a law of motion.

The result is not the final theory of music. It is something better than that: a tractable, layered, mathematically articulate model in which the universe of pitch content, cyclic order, and their spectral completion can be studied without flattening away the differences that made the problem worth posing in the first place.

The geometry of musical possibility begins as a catalog of patterns, but reaches maturity only when it becomes a geometry of lawful motion.

## Notes

1. Andrew Duncan, *Combinatorial Music Theory*, *Journal of the Audio Engineering Society* 39, no. 6 (1991): 427-448. Duncan's accessible overview page presents the same core intuition in informal form and remains a useful conceptual entry point.

2. For the spectral side of the story and the incompleteness of magnitude-only information, see Jason Yust and Emmanuel Amiot, "Non-Spectral Transposition-Invariant Information in Pitch-Class Sets and Distributions," in *Mathematics and Computation in Music*, LNCS 13267 (2022), 279-291. Their discussion of transposition-invariant phase information sharpens the point that Z-related sets share interval-content spectra without being identical under transposition or inversion.

3. Nicolas Slonimsky, *Thesaurus of Scales and Melodic Patterns* (New York: Charles Scribner's Sons, 1947). The present essay does not claim that Slonimsky worked in Fourier language; rather, it argues that his interval-cycle organization can be restated naturally in that language.

4. For the broader geometric precedent, see Clifton Callender, Ian Quinn, and Dmitri Tymoczko, "Generalized Voice-Leading Spaces," *Science* 320, no. 5874 (2008): 346-348; and Dmitri Tymoczko, *A Geometry of Music: Harmony and Counterpoint in the Extended Common Practice* (New York: Oxford University Press, 2011).

5. For standard symplectic background, see V. I. Arnold, *Mathematical Methods of Classical Mechanics*, 2nd ed. (New York: Springer, 1989); and Dusa McDuff and Dietmar Salamon, *Introduction to Symplectic Topology*, 3rd ed. (Oxford: Oxford University Press, 2017).

6. The language of singular stabilizers, orbifold-like quotients, and reduced spaces is motivated here by the same general quotient-geometric issues emphasized by Callender, Quinn, and Tymoczko and developed at greater length in Tymoczko's later book.

7. For complementary approaches to visualization and organization, see Art Samplaski, "Mapping the Geometries of Pitch-Class Set Similarity Measures via Multidimensional Scaling," *Music Theory Online* 11, no. 2 (2005); Louis Bigo, Daniele Ghisi, Antoine Spicher, and Moreno Andreatta, "Representation of Musical Structures and Processes in Simplicial Chord Spaces," *Computer Music Journal* 39, no. 3 (2015): 9-24; and Ronald R. Coifman and Stephane Lafon, "Diffusion Maps," *Applied and Computational Harmonic Analysis* 21, no. 1 (2006): 5-30.

## Selected References

Arnold, V. I. *Mathematical Methods of Classical Mechanics*. 2nd ed. New York: Springer, 1989.

Bigo, Louis, Daniele Ghisi, Antoine Spicher, and Moreno Andreatta. "Representation of Musical Structures and Processes in Simplicial Chord Spaces." *Computer Music Journal* 39, no. 3 (2015): 9-24.

Callender, Clifton, Ian Quinn, and Dmitri Tymoczko. "Generalized Voice-Leading Spaces." *Science* 320, no. 5874 (2008): 346-348.

Coifman, Ronald R., and Stephane Lafon. "Diffusion Maps." *Applied and Computational Harmonic Analysis* 21, no. 1 (2006): 5-30.

Duncan, Andrew. "Combinatorial Music Theory." *Journal of the Audio Engineering Society* 39, no. 6 (1991): 427-448.

McDuff, Dusa, and Dietmar Salamon. *Introduction to Symplectic Topology*. 3rd ed. Oxford: Oxford University Press, 2017.

Samplaski, Art. "Mapping the Geometries of Pitch-Class Set Similarity Measures via Multidimensional Scaling." *Music Theory Online* 11, no. 2 (2005).

Slonimsky, Nicolas. *Thesaurus of Scales and Melodic Patterns*. New York: Charles Scribner's Sons, 1947.

Tymoczko, Dmitri. *A Geometry of Music: Harmony and Counterpoint in the Extended Common Practice*. New York: Oxford University Press, 2011.

Yust, Jason, and Emmanuel Amiot. "Non-Spectral Transposition-Invariant Information in Pitch-Class Sets and Distributions." In *Mathematics and Computation in Music*, LNCS 13267, 279-291. 2022.
