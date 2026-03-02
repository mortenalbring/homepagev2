import React from 'react';
import './PopupStyles.css';
import {MathJax, MathJaxContext} from "better-react-mathjax";

export function OldStuffContent() {
    return (
        <div className="popup-content-inner">
            <h3>Old Stuff</h3>
            <MathJaxContext>
                <p>
                    This post is about the fundamental link between thermodynamics and computations. This is not on the
                    practical level, about the heat dissipation of circuitry - though of course that is a very important
                    concern when building computer compontents. This is about a fundamental and unavoidable mathematical
                    link between the very concept of computation and our understanding of thermodynamics.

                    There is a profound difference between how the real world behaves, and how computers simulate
                    processes.
                    This was identified in a keynote speech in 1981 by Richard Feynman, making one simple observation:
                </p>
                <p>
                    A process is physically reversible if the initial state can be recovered from the initial state
                    without
                    changing the system. That is so say, if there is no preferred arrow of time.
                </p>
                <p>
                    This is a concept introduced by Arthur Eddington, an astronomer and mathematician. Eddington was
                    also a
                    Quaker, and declared himself a pacifist during World War 1. His religious beliefs were expressed in
                    his
                    writings on the philosophy of science in his work Science and the unseen world, published 1929.
                    Eddington wrote that the unseen world could not be discovered from science alone but must also be
                    sought
                    through the understanding of spiritual reality.
                </p>

                The arrow of time is itself a philosophical concept as much as it is a mathematical one.

                <p>

                    Consider the dynamics of a collection of j particles with mass m governed by Newtonian equations of
                    motion
                </p>


                <MathJax>
                    {'  \\[m\\frac{d^2}{dt^2}q_{j}(t) = F_{j}(q_{1}(t),...,q_{N}(t))\\]'}
                </MathJax>


                <p>This equation is <em>invariant</em> under a time reversal. If we
                    substitute <em>t</em> for <em>-t</em>,
                    this equation remains the same. </p>
                <p>If we were to use a very tiny video recorder to record the motion of these particles and then play it
                    back, we would have no idea whether the video was being played forward or in reverse. There is no
                    experiment we could do or calculation we could perform to deduce the arrow of time from the video
                    recording of the motions of these particles. </p>
                <p>However, let's now consider the case of an expanding gas. At the microscopic level, the motion of the
                    atoms of this gas satisfies the equation above. However, if we were to zoom out and film the
                    expanding
                    gas it would be obvious whether the video recording were being played forwards or backwards. When
                    being
                    played forwards, we see the gas expanding. When being played backwards, it would appear the gas is
                    spontaneously condensing. </p>
                <p>The physical properties of low density gases were described by Ludwig Boltzmann, Austrian physicist
                    and
                    philosopher. Boltzmann developed his theory of gases on the assumption that matter was made of atoms
                    and
                    molecules, a theory that was heavily disputed at the end of the 19th century and dismissed by German
                    philosophers such as Mach and Ostwald. Boltzmann managed to develop a model that would satisfy both
                    camps, discussing atoms as 'models' of reality that the anti-atomists could consider as a useful -
                    though unrealistic - mathematical fabrication. A similar discussion would arise a century later over
                    the
                    concept of Feynmann diagrams, outlining the interactions of subatomic particles. </p>


                <p>
                    Boltzmann introduced the distribution function{" "}
                    <MathJax inline>
                        {"\\(f(\\vec{r},\\vec{v},t)\\)"}
                    </MathJax>{" "}
                    to count the number of molecules within the volume element{" "}
                    <MathJax inline>
                        {"\\(d^3r\\)"}
                    </MathJax>{" "}
                    at a position{" "}
                    <MathJax inline>
                        {"\\(\\vec{r}\\)"}
                    </MathJax>{" "}
                    and the velocity volume element{" "}
                    <MathJax inline>
                        {"\\(d^3v\\)"}
                    </MathJax>{" "}
                    at{" "}
                    <MathJax inline>
                        {"\\(\\vec{v}\\)"}
                    </MathJax>{" "}
                    at a time <em>t</em>. This gives us the <em>Boltzmann equation</em>.

                    <p>
                        <MathJax>
                            {
                                "\\[\\frac{d}{dt}f(t) = -\\vec{v} \\cdot \\Delta_{r}f(t) + Q(f(t),f(t))\\]"
                            }
                        </MathJax>
                    </p>

                    <br/>

                    <p>
                        The first term in this equation describes the free motion of particles,
                        while the second term describes the binary collisions between pairs of
                        particles.
                    </p>

                    <p>
                        In this equation, if we substitute <em>t</em> for <em>-t</em>, the equation
                        does <strong>not</strong> remain unchanged. As we also have to change the
                        sign of the velocity <em>v</em>, the second term ends up with a negative
                        sign.
                    </p>

                    <p>
                        This is our first indication of an irreversible process arising entirely
                        out of reversible fundamental physics.
                    </p>
                </p>

                <div>
                    <h3>The Exorcism of Maxwell's Demon</h3>

                    <p>
                        This concept of irreversibility is inseparable from the Second Law of
                        Thermodynamics, which may well be the only fundamental law of physics
                        that exhibits an intrinsic arrow of time. Historically, this law has
                        been stated in many different but equivalent ways, combining heat and
                        work to the conceptual meaning of time. The variable entropy was
                        introduced to quantify this relation.
                    </p>

                    <p>
                        One statement of the Second Law of Thermodynamics is it is never possible
                        for a cyclic process to convert heat entirely into work, so that in a
                        closed system the overall entropy must always increase.
                    </p>

                    <p>
                        The possibility of violating this law is encapsulated by Maxwell's Demon
                        thought experiment. This formulation shows how thermodynamic
                        irreversibility is linked to the act of measurement and introduces the
                        link between entropy and information.
                    </p>

                    <img
                        className="img-thumbnail center-block"
                        src="/images/computations/slizardbennet.jpg"
                        alt=""
                    />

                    <p>
                        The image above shows a single molecule <em>Slizard engine</em>. A
                        Slizard engine is the simplest possible steam engine, consisting of a
                        cylinder with a single molecule inside it. The cylinder is in contact
                        with a heat reservoir to maintain constant thermal conditions. There is,
                        however, a demon outside this cylinder that controls a partition that can
                        either open or close the partition at will.
                    </p>

                    <p>
                        The phase space representing what the demon "knows" about the position
                        of the molecule. This phase space has three states:
                    </p>

                    <div className="panel-code">
                        <ul>
                            <li>S meaning the demon knows nothing</li>
                            <li>L if the demon knows the particle is at the left side</li>
                            <li>R if the demon knows it is on the right side</li>
                        </ul>
                    </div>

                    <p>The engine goes through six steps in the procedure:</p>

                    <div className="panel-code">
                        <ol>
                            <li>
                                The molecule is in the thermal path and moves randomly throughout
                                this box
                            </li>
                            <li>
                                The demon inserts a dividing wall into the box to hold the molecule
                                on the left side or the right side
                            </li>
                            <li>
                                The demon carries out a reversible measurement to determine whether
                                the molecule is on the left or the right
                            </li>
                            <li>
                                The demon inserts a piston on the side <em>not</em> containing the
                                molecule and uses this to extract work from the molecule bouncing
                                against the partition.
                                <br/>
                                The amount of work extracted can be calculated using the ideal gas
                                equation{" "}
                                <MathJax inline>{"\\(pV = NkT\\)"}</MathJax>{" "}
                                where in this case <em>N = 1</em>. The maximum work extracted is{" "}
                                <MathJax inline>{"\\(W = kT \\ln(2)\\)"}</MathJax>
                            </li>
                            <li>The piston has moved to fill the box again</li>
                            <li>
                                The system is reset and both the demon and the box are at the same
                                state as when it started
                            </li>
                        </ol>
                    </div>
                </div>
            </MathJaxContext>
        </div>
    );
}
