import axios from "axios";

let palvelin = "http://localhost:8080/";

export const getKirjat = async () => {
  try {
    const response = await axios.get(palvelin + "kirja/all");
    return response;
  } catch (error) {
    return {
      status: error.status,
      message: "Haku ei onnistunut: " + error.message,
    };
  }
};

export const addKirja = async (kirja) => {
  try {
    const response = await axios.post(palvelin + "kirja/add", kirja, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return response;
  } catch (error) {
    return {
      status: error.status,
      message: "Lisäys ei onnistunut: " + error.message,
    };
  }
};

export const getKirja = async (id) => {
  try {
    const response = await axios.get(palvelin + "kirja/one/" + id);
    return response;
  } catch (error) {
    return {
      status: error.status,
      message: "Kirjan haku ei onnisutunut: " + error.message,
    };
  }
};

export const deleteKirja = async (id) => {
  try {
    const response = await axios.delete(palvelin + "kirja/delete/" + id);
    return response;
  } catch (error) {
    return {
      status: error.status,
      message: "Poisto ei onnistunut: " + error.message,
    };
  }
};

export const editKirja = async (id, kirja) => {
  try {
    const response = await axios.put(palvelin + "kirja/edit/" + id, kirja, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return response;
  } catch (error) {
    return {
      status: error.status,
      message: "Muokkaus ei onnistunut: " + error.message,
    };
  }
};
