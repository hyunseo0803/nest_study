import { AuthDto } from '../dto/auth.dto';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AuthDto)
export class UserAuthorityRepository extends Repository<AuthDto> {}
