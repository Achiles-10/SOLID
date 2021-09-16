import { User } from "../../entities/User";
import { IMailProvider } from "../../providers/IMailProvider";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { ICreateUserRequestDTO } from "./CreateUserDTO";


export class CreateUserUseCase {
    constructor(
        private usersRepository: IUsersRepository,
        private mailProvider: IMailProvider,
    ) {}

    async execute(data: ICreateUserRequestDTO) {
        const userAlreadyExist = await this.usersRepository.findByEmail(data.email);

        if (userAlreadyExist) {
            throw new Error('User already exist.');
        }

        const user = new User(data);

        await this.usersRepository.save(user);

        this.mailProvider.sendMail({
            to: {
                name: data.name,
                email: data.email,
            },
            from: {
                name: 'My store team',
                email: 'equipe@meustore.com',
            },
            subject: 'Welcome to my space',
            body: '<p> You can access our products.</p>'
        })


    }
}