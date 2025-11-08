import Tanque from "../models/Tanque.js";

// Obtener todos los tanques
export const getTanques = async (req, res) => {
  try {
    const tanques = await Tanque.find()
      .populate("user", "name email") 
      .sort({ createdAt: -1 });

    res.json({ ok: true, tanques });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al obtener los tanques" });
  }
};

// Crear un nuevo tanque
export const crearTanque = async (req, res) => {
  try {
    const { name, capacity, status } = req.body;

    const tanque = new Tanque({
      name,
      capacity,
      status,
      user: req.uid, // viene del middleware JWT
    });

    const tanqueGuardado = await tanque.save();
    res.status(201).json({ ok: true, tanque: tanqueGuardado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al crear el tanque" });
  }
};


// Editar un tanque existente

export const editarTanque = async (req, res) => {
  const { id } = req.params;

  try {
    const tanque = await Tanque.findById(id);
    if (!tanque) {
      return res.status(404).json({ ok: false, msg: "Tanque no encontrado" });
    }

    const tanqueActualizado = await Tanque.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json({ ok: true, tanque: tanqueActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al actualizar el tanque" });
  }
};


// Eliminar un tanque
export const eliminarTanque = async (req, res) => {
  const { id } = req.params;

  try {
    const tanque = await Tanque.findById(id);
    if (!tanque) {
      return res.status(404).json({ ok: false, msg: "Tanque no encontrado" });
    }

    await Tanque.findByIdAndDelete(id);
    res.json({ ok: true, msg: "Tanque eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al eliminar el tanque" });
  }
};
