import dbManager from "../db"
import { plants } from "../db/schema"
import { and, between, eq, InferColumnsDataTypes, InferInsertModel, InferSelectModel, sql } from 'drizzle-orm'
import { AppError } from "../utils/errors"

export type RawPlant = InferSelectModel<typeof plants>
export type TPlantCreateArgs = InferInsertModel<typeof plants>
export type TPlant = RawPlant


export interface ShallowPlant {
    name: {
        genusName: string;
        speciesName?: string;
        varietyName?: string;
        name1a?: {
            species: boolean;
            name: string;
        };
        name1b?: {
            species: boolean;
            name: string;
        };

        name2a?: {
            species: boolean;
            name: string;
        };

        name2b?: {
            species: boolean;
            name: string;
        };
    },
    from?: string,
    image?: string,
    fontSize: string
    // ETC
}

export interface DeepPlant extends ShallowPlant {
    id: string,
}


export default class PlantModel {
    constructor() {

    }

    public static factory(params: RawPlant): TPlant {
        const { id, name, createdAt, userId, fontSize } = params
        return { id, name, createdAt, userId, fontSize }
    }

    public async create(args: TPlantCreateArgs): Promise<TPlant> {
        const query = dbManager.db.insert(plants)
            .values(args)
            .returning()
            .prepare(
                'createRating' + new Date().getTime()
            )

        const [result, ..._] = await query.execute()
        if (!result) {
            throw new AppError('Something went wrong while rating', 400)
        }

        return result
    }

    public async getByUserId(userId: number): Promise<TPlant[]> {
        const query = dbManager.db.select()
            .from(plants)
            .where(eq(plants.userId, userId))
            .prepare('getByUserId' + new Date().getTime())

        const result = await query.execute()
        return result
    }
}