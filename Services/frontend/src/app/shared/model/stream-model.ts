export interface StreamMetadata {
    _id: string,
    title: string,
    thumbnail: string,
    description: string,
    status: string,
    author: string,
}

export interface NewStream {
    title: string,
    thumbnail: string,
    description: string,
    type: string,
    invited: string[]
}

export interface UserStream {
    _id: string,
    title: string,
    thumbnail: string,
    description: string,
    type: string,
    invited: string[],
    status: string,
    author: string,
    streamkey: string
}
