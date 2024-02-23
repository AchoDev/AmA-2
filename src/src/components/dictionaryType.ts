import Path from "./path";

interface Word {
    mainLang: string
    secondLang: string
    notes: Path[]
    tag: string
}

enum GridType {
    none,
    list,
    grid,
}

interface PageSettings {
    gridType: GridType
}

interface Page {
    title: string
    content: Path[]
    settings: PageSettings
}

interface Dictionary {
    title: string,
    mainLang: string,
    secondLang: string,
    tags: string[],
    words: Word[]
    pages: Page[]
}

export type { Dictionary, Word, Page, PageSettings, GridType }
