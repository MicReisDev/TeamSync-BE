const RolePermissionService = require('../services/RolePermissaoServices');

class RolePermissaoController {
  constructor() {}



  async criarRole(req, res) {
    try {
      const data = req.body;
      const result = await RolePermissionService.criarRole(data);
      res.status(201).json(result); 
    } catch (error) {
      console.error(error);
      res.status(500).json( error ); 
    }
  }

  async updateRole(req, res) {
    try {
      const data = req.body;
      const {id} = req.params
      const result = await RolePermissionService.updateRole(data,id);
      res.status(201).json(result); 
    } catch (error) {
      console.error(error);
      res.status(500).json( error ); 
    }
  }
  
  async todasAsRoles(req, res) {
    try {
      const filtro = req.query;
      const result = await RolePermissionService.todasAsRoles(filtro);
      res.status(200).json(result); 
    } catch (error) {
      console.error(error);
      res.status(500).json( error ); 
    }
  }

  async todasAsPermissoes(req, res) {
    try {
      const filtro = req.query;
      const result = await RolePermissionService.todasAsPermissoes(filtro);
      res.status(200).json(result); 
    } catch (error) {
      console.error(error);
      res.status(500).json( error ); 
    }
  }

  async todasAsRolesComPermissions(req, res) {
    try {
      const filtro = req.query;
      const result = await RolePermissionService.todasAsRolesComPermissions(filtro);
      res.status(200).json(result); 
    } catch (error) {
      console.error(error);
      res.status(500).json( error ); 
    }
  }



  
  
}

module.exports = new RolePermissaoController();
