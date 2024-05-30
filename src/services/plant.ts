import PlantModel, { ShallowPlant } from "../models/plant";
import { TPlant, TPlantCreateArgs } from "../models/plant";
import UserModel, { TUser } from "../models/user";

class PlantService {
    model: PlantModel
    userModel: UserModel
    constructor() {
        this.model = new PlantModel()
        this.userModel = new UserModel()
    }

    /**
     * @param user The id of the user whose ratings to get
     * @returns 
     */
    public async getByUser(userId: number): Promise<TPlant[]>
    /**
     * @param user The user whose ratings to get
     * @returns 
     */
    public async getByUser(user: TUser): Promise<TPlant[]>
    public async getByUser(user: TUser | number): Promise<TPlant[]> {
        let userId: number
        if (typeof user === 'number') {
            userId = user
        } else {
            userId = user.id
        }
        const ratings = await this.model.getByUserId(userId)
        return ratings
    }

    /**
     * @param args The payload to create a new plant
     * @returns the newly created plant
     */
    public async createPlant(args: TPlantCreateArgs): Promise<TPlant> {
        // const name = args.name
        // const nameWithDefaultValues = fillWithDefaultValues(name)
        const newRating = await this.model.create(args)
        return newRating
    }
}
// function fillWithDefaultValues(name: ShallowPlant['name']) {
//     const {name1a, name1b, name2a, name2b} = name
// }
const plantService = new PlantService()
export default plantService
