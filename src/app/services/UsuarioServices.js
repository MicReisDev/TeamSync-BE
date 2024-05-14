const UsuarioRepositories = require('../repositories/UsuarioRepositories');
const BaseRepositories = require('../repositories/BaseRepositories');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment')
require('dotenv').config()

class UsuarioService {
  constructor() { }

  async Criar(data) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const pastas = data.pastas
    delete data.pastas

    if (data.senha != data.confirmSenha) throw { error: 'erro de senha', message: 'as senhas devem ser iguais' }
    delete data.confirmSenha
    const hashedPassword = await bcrypt.hash(data.senha, salt);
    const id_role = data.role
    delete data.role
    data.senha = hashedPassword;
    const id_usuario = await UsuarioRepositories.insert({ data })

    const usuario_role = new BaseRepositories('usuario_role')
    const usuario_pasta = new BaseRepositories('usuario_pasta')

    await usuario_role.Basicinsert({ id_role, id_usuario })

    for (let pasta of pastas) {
      await usuario_pasta.Basicinsert({ id_pasta: pasta.id_pasta, id_usuario })
    }

    return id_usuario;
  }

  async Editar(data) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);


    const pastas = data.pastas
    delete data.pastas


    if (data.senha) {
      if (data.senha != data.confirmSenha) throw { error: 'erro de senha', message: 'as senhas devem ser iguais' }
      delete data.confirmSenha
      const hashedPassword = await bcrypt.hash(data.senha, salt);
      data.senha = hashedPassword;
    } else {
      delete data.senha
      delete data.confirmSenha
    }

    let [usuario] = await UsuarioRepositories.select({ id: data.id_usuario })



    const id_usuario = data.id_usuario



    let id_role = ''
    for (let role of usuario.roles) {
      if (role != data.id_role) { id_role = data.role }
    }

    delete data.id_usuario
    delete data.role

    const update = await UsuarioRepositories.update({ condicao: { id_usuario }, data })
    const user_role = new BaseRepositories('usuario_role')
    if (id_role != '') await user_role.basicUpdate({ condicao: { id_usuario }, data: { id_role } })
    const usuario_pasta = new BaseRepositories('usuario_pasta')
    if (pastas) {
      await usuario_pasta.delete({ condicao: { id_usuario } })

      for (let pasta of pastas) {
        await usuario_pasta.Basicinsert({ id_pasta: pasta.id_pasta, id_usuario })
      }
    }

    return update;
  }
  async Delete(id) {
    const excluido = moment().format('YYYY-MM-DD HH:mm:ss')
    return UsuarioRepositories.update({ condicao: { id_usuario: id }, data: { excluido } })
  }

  async Login(data) {
    try {
      const Usuario = await UsuarioRepositories.login(data.username);

      if (Usuario.length === 0) throw { error: "Usuário ou senha incorretos" };


      let usuarioEncontrado = Usuario[0];

      const confirmar = await bcrypt.compare(data.senha, usuarioEncontrado.senha);

      if (!confirmar) {
        throw { error: "Usuário ou senha incorretos" };
      }

      delete usuarioEncontrado.senha;
      delete usuarioEncontrado.criado;
      delete usuarioEncontrado.modificado;

      let secret = process.env.SECRET
      let user = {
        id_usuario: usuarioEncontrado.id_usuario,
        nome: usuarioEncontrado.nome,
      }
      const token = jwt.sign(user, process.env.SECRET, { expiresIn: '1d' });


      return {
        ...usuarioEncontrado,
        token
      };
    } catch (error) {
      throw error;
    }
  }


  async PegarTodosUsuarios(filtro) {
    const retorno = await UsuarioRepositories.select(filtro)
    return retorno;
  }

  async pegarUsuario(id) {
    const [retorno] = await UsuarioRepositories.get({ filtro: { id_usuario: id } })
    retorno.senha = undefined
    return retorno;
  }

  async atualizarUsuario(id, data) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    if (data.senha) {
      if (data.senha != data.confirmSenha) throw { error: 'erro de senha', message: 'as senhas devem ser iguais' }
      delete data.confirmSenha
      const hashedPassword = await bcrypt.hash(data.senha, salt);
      data.senha = hashedPassword;
    } else {
      delete data.senha
      delete data.confirmSenha
    }
    delete data.id_usuario
    const retorno = await UsuarioRepositories.update({ condicao: { id_usuario: id }, data })

    return retorno;
  }

  async auth(filtro) {
    const retorno = await UsuarioRepositories.auth(filtro)
    return retorno;
  }

}

module.exports = new UsuarioService();
