
export type PaginationOutputDto<Model> = {
    items: Model[]
    total: number
    current_page: number
    per_page: number
    last_page: number
    sort: string | null
    sort_dir: string | null
    filter: string | null
}

export class PaginationOutputMapper {
    static toOutput<Item = any>(items: Item[], result: any): PaginationOutputDto<Item> {
        const perPage = Number(result.per_page) || 1
        const total = Number(result.total) || 0
        return {
            items,
            total,
            current_page: Number(result.current_page) || 1,
            per_page: perPage,
            last_page: total === 0 ? 0 : Math.ceil(total / perPage),
            sort: result.sort ?? null,
            sort_dir: result.sort_dir ?? null,
            filter: result.filter ?? null,
        }
    }
}
