import React from 'react';
import './PopupStyles.css';
import {MathJax, MathJaxContext} from "better-react-mathjax";

export function OldStuffContent() {
    return (
        <div className="popup-content-inner">
            <h3>Old Stuff</h3>
            <p>
                This post is about the fundamental link between thermodynamics and computations. This is not on the
                practical level, about the heat dissipation of circuitry - though of course that is a very important
                concern when building computer compontents. This is about a fundamental and unavoidable mathematical
                link between the very concept of computation and our understanding of thermodynamics.

                There is a profound difference between how the real world behaves, and how computers simulate processes.
                This was identified in a keynote speech in 1981 by Richard Feynman, making one simple observation:
            </p>
            <p>
                A process is physically reversible if the initial state can be recovered from the initial state without
                changing the system. That is so say, if there is no preferred arrow of time.
            </p>
            <p>
                This is a concept introduced by Arthur Eddington, an astronomer and mathematician. Eddington was also a
                Quaker, and declared himself a pacifist during World War 1. His religious beliefs were expressed in his
                writings on the philosophy of science in his work Science and the unseen world, published 1929.
                Eddington wrote that the unseen world could not be discovered from science alone but must also be sought
                through the understanding of spiritual reality.
            </p>

            The arrow of time is itself a philosophical concept as much as it is a mathematical one.

            <p>

                Consider the dynamics of a collection of j particles with mass m governed by Newtonian equations of
                motion
            </p>

            <MathJaxContext>
                <MathJax>
                    {'  \\[m\\frac{d^2}{dt^2}q_{j}(t) = F_{j}(q_{1}(t),...,q_{N}(t))\\]'}
                </MathJax>
            </MathJaxContext>

            <p>This equation is <em>invariant</em> under a time reversal. If we substitute <em>t</em> for <em>-t</em>,
                this equation remains the same. </p>
            <p>If we were to use a very tiny video recorder to record the motion of these particles and then play it
                back, we would have no idea whether the video was being played forward or in reverse. There is no
                experiment we could do or calculation we could perform to deduce the arrow of time from the video
                recording of the motions of these particles. </p>
            <p>However, let's now consider the case of an expanding gas. At the microscopic level, the motion of the
                atoms of this gas satisfies the equation above. However, if we were to zoom out and film the expanding
                gas it would be obvious whether the video recording were being played forwards or backwards. When being
                played forwards, we see the gas expanding. When being played backwards, it would appear the gas is
                spontaneously condensing. </p>
            <p>The physical properties of low density gases were described by Ludwig Boltzmann, Austrian physicist and
                philosopher. Boltzmann developed his theory of gases on the assumption that matter was made of atoms and
                molecules, a theory that was heavily disputed at the end of the 19th century and dismissed by German
                philosophers such as Mach and Ostwald. Boltzmann managed to develop a model that would satisfy both
                camps, discussing atoms as 'models' of reality that the anti-atomists could consider as a useful -
                though unrealistic - mathematical fabrication. A similar discussion would arise a century later over the
                concept of Feynmann diagrams, outlining the interactions of subatomic particles. </p>
    

        </div>
    );
}
