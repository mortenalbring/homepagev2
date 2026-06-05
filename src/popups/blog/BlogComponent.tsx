import React from "react";
import {Localized, T} from "../../i18n";
import "./BlogComponent.css";

/**
 * Blog post listing. Each post body is authored side-by-side in English and
 * Norwegian using <Localized>. To add a new post: copy a <BlogPost> block and
 * fill in the `en` / `no` slots. If you only have English ready, omit the
 * `no` key — it falls back automatically.
 */
export function BlogComponent() {
    return (
        <div className="blog-content win95-text-ui">
            <div className="blog-header">
                <span className="blog-icon">📓</span>
                <h3 className="blog-title">
                    <T en="Notepad — Blog" no="Notisblokk — Blogg"/>
                </h3>
            </div>
            <div className="blog-text win95-panel-inset">
                <BlogPost
                    date="2026-06-05"
                    title={{en: "Hello, world", no: "Hei, verden"}}
                >
                    <Localized>{{
                        en: <>
                            <p>Welcome to my blog! Posts will appear here as I write them.</p>
                            <p>This site is a Windows 95 / 98 themed personal page — drag
                                windows around, double-click icons, poke through the start menu.</p>
                            <p>Toggle the <strong>EN / NO</strong> button in the taskbar to
                                see Norwegian translations of the content.</p>
                        </>,
                        no: <>
                            <p>Velkommen til bloggen min! Innlegg dukker opp her etter hvert som jeg skriver dem.</p>
                            <p>Denne siden er en personlig side i Windows 95 / 98-stil — dra
                                vinduer rundt, dobbeltklikk på ikoner, utforsk startmenyen.</p>
                            <p>Trykk på <strong>EN / NO</strong>-knappen i oppgavelinjen
                                for å bytte språk.</p>
                        </>,
                    }}</Localized>
                </BlogPost>

                <hr/>

                <BlogPost
                    date="2026-06-04"
                    title={{en: "Coming soon", no: "Kommer snart"}}
                >
                    <Localized>{{
                        en: <p>More posts on the way. Check back later for updates!</p>,
                        no: <p>Flere innlegg på vei. Kom tilbake snart!</p>,
                    }}</Localized>
                </BlogPost>
            </div>
        </div>
    );
}

interface BlogPostProps {
    date: string;
    title: { en: string; no?: string };
    children: React.ReactNode;
}

function BlogPost({date, title, children}: BlogPostProps) {
    return (
        <article className="blog-post">
            <header className="blog-post-header">
                <h4 className="blog-post-title">
                    <T en={title.en} no={title.no ?? title.en}/>
                </h4>
                <time className="blog-post-date" dateTime={date}>{date}</time>
            </header>
            <div className="blog-post-body">{children}</div>
        </article>
    );
}

