import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export class Password {
  private password: string;

  constructor(password?: string) {
    this.password = password;
  }

  static async bcryptPassword(password: string) {
    if (!password) {
      throw new HttpException('password incorrect!', HttpStatus.BAD_REQUEST);
    }
    const saltRound = 10;
    const salt: string = await bcrypt.genSaltSync(saltRound);
    const hash: string = await bcrypt.hashSync(password.toString(), salt);
    return hash;
  }

  /**
   *
   * @param password là password nguyên bản mà client nhập (ví dụ: 123456)
   * @param bcryptPassword là password đã được mã hóa thành bcrypt
   * @returns boolean
   */
  static async comparePassword(password: string, bcryptPassword: string): Promise<boolean> {
    if (!password || !bcryptPassword) {
      throw new HttpException('password incorrect!', HttpStatus.BAD_REQUEST);
    }

    const comParePassword: boolean = await bcrypt.compareSync(password.toString(), bcryptPassword);
    return comParePassword;
  }
}
