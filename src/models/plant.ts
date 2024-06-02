import dbManager from "../db"
import { plants } from "../db/schema"
import { and, between, eq, InferColumnsDataTypes, InferInsertModel, InferSelectModel, sql } from 'drizzle-orm'
import { AppError } from "../utils/errors"
import { PlantTypeCol } from "../services/plant"

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
    fromTrader?: number | null,
    location?: string,
    type?: PlantTypeCol,
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
        const { id, name, createdAt, userId, fontSize, fromTrader, location, type } = params
        return { id, name, createdAt, userId, fontSize, fromTrader, location, type }
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

    public async getById<B extends boolean = true>(id: number, require: B): Promise<TPlant>
    public async getById(id: number): Promise<TPlant | undefined>
    public async getById<B extends boolean = false>(id: number, require?: B) {
        const query = dbManager.db.select()
            .from(plants)
            .where(eq(plants.id, id))
            .prepare('getByPlantId' + new Date().getTime())

        const [result, ..._] = await query.execute()

        if (result) {
            const plant = PlantModel.factory(result)
            return plant
        } else {
            if (require) throw new AppError('Plant not found', 404)
            return undefined
        }
    }

    public async getByUserId(userId: number): Promise<TPlant[]> {
        const query = dbManager.db.select()
            .from(plants)
            .where(eq(plants.userId, userId))
            .prepare('getByUserId' + new Date().getTime())

        const result = await query.execute()
        return result
    }

    public async update(id: number, { name, fontSize, fromTrader, location, type }: Partial<InferInsertModel<typeof plants>>): Promise<TPlant> {
        const updateObject: Partial<InferInsertModel<typeof plants>> = {}
        if (name) updateObject.name = name
        if (fontSize) updateObject.fontSize = fontSize
        if (fromTrader || fromTrader === null) updateObject.fromTrader = fromTrader
        if (location || location === '' || location === null) updateObject.location = location
        if (type) updateObject.type = type

        const query = dbManager.db.update(plants)
            .set(updateObject)
            .where(eq(plants.id, id))
            .returning()
            .prepare('updatePlant' + new Date().getTime())

        const [result, ..._] = await query.execute()

        if (!result) {
            throw new AppError('Plant not found', 404)
        }
        return result
    }
}