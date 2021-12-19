const TaskModel = require("../model/TaskModel");

const { isPast } = require("date-fns");

const TaskValidation = async (req, res, next) => {
  const { macaddress, type, title, description, when } = req.body;

  if (!macaddress)
    return res
      .status(400)
      .json({ error: "O preenchimento do Macaddress é obrigatorio" });
  else if (!type)
    return res
      .status(400)
      .json({ error: "A escolha do TIPO de atividade é obrigatorio" });
  else if (!title)
    return res
      .status(400)
      .json({ error: "O Preenchimento do TITULO é obrigatorio" });
  else if (!description)
    return res
      .status(400)
      .json({ error: "O Preenchimento da DESCRIÇÃO é obrigatorio" });
  else if (!when)
    return res
      .status(400)
      .json({ error: "O Preenchimento da DATA e HORA são obrigatorios" });
  else {
    let exists;

    if (req.params.id) {
      exists = await TaskModel.findOne({
        _id: { $ne: req.params.id },
        when: { $eq: new Date(when) },
        macaddress: { $in: macaddress },
      });
    } else {
      if (isPast(new Date(when)))
        return res
          .status(400)
          .json({ error: "Escolha uma data e hora futura." });
      exists = await TaskModel.findOne({
        when: { $eq: new Date(when) },
        macaddress: { $in: macaddress },
      });
    }
    if (exists) {
      return res
        .status(400)
        .json({ error: "Já existe atividade nesse horário!" });
    }
  }

  next();
};

module.exports = TaskValidation;
