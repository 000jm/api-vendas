
export type UploaderProps = {
    filename: string
    filetype: string
    body: Buffer
}

export interface UploaderProvider {
    upload: (params: UploaderProps) => Promise<string>
    delete: (filename: string) => Promise<void>
}
