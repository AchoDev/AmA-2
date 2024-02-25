import Path from "./path";

interface Word {
    mainLang: string
    secondLang: string
    notes: Path[]
    tag: string
}

enum GridType {
    none,
    lined,
    checkered,
}

interface PageSettings {
    gridType: GridType
    gridSize: number
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

export {GridType}
export type { Dictionary, Word, Page, PageSettings }
