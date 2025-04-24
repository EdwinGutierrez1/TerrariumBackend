// backend/services/cobertura.service.js
const supabase = require('../config/supabase.config');

exports.getLastCoberturaNumber = async () => {
    const { data, error } = await supabase
        .from('cobertura')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);

    if (error) throw error;

    if (data && data.length > 0) {
        const lastId = data[0].id;
        return parseInt(lastId.substring(1), 10);
    } else {
        return 0;
    }
    };

    exports.insertCoberturas = async (coberturas, idSubparcela) => {
    try {
        const coberturasData = [];
        let lastNumber = await this.getLastCoberturaNumber();

        for (const cobertura of coberturas) {
        lastNumber += 1;
        const id = `C${String(lastNumber).padStart(3, '0')}`;
        coberturasData.push({
            id,
            nombre: cobertura.tipo,
            porcentaje: parseInt(cobertura.porcentaje, 10),
            id_subparcela: idSubparcela
        });
        }

        const { error } = await supabase
        .from('cobertura')
        .insert(coberturasData);

        if (error) throw error;

        return coberturasData;
    } catch (error) {
        console.error('Error al insertar coberturas:', error);
        throw error;
    }
};

exports.getLastAlteracionNumber = async () => {
    const { data, error } = await supabase
        .from('alteracion')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);

    if (error) throw error;

        if (data && data.length > 0) {
        const lastId = data[0].id;
        return parseInt(lastId.substring(1), 10);
        } else {
        return 0;
        }
};

exports.insertAlteraciones = async (afectaciones, idSubparcela) => {
    try {
        const alteracionesData = [];
        let lastNumber = await this.getLastAlteracionNumber();
        for (const afectacion of afectaciones) {
        lastNumber += 1;
        const id = `A${String(lastNumber).padStart(3, '0')}`;
        alteracionesData.push({
            id,
            nombre: afectacion.tipo,
            severidad: afectacion.severidad,
            id_subparcela: idSubparcela
        });
    }

    const { error } = await supabase
        .from('alteracion')
        .insert(alteracionesData);
    if (error) throw error;

    return alteracionesData;
    } catch (error) {
        console.error('Error al insertar alteraciones:', error);
        throw error;
    }
};

exports.sincronizarSubparcelas = async (subparcelasCaracteristicas) => {
    try {
        const resultados = {
        coberturas: [],
        alteraciones: []
        };
    
        for (const idSubparcela in subparcelasCaracteristicas) {
            const subparcela = subparcelasCaracteristicas[idSubparcela];
    
            if (subparcela.coberturas && subparcela.coberturas.length > 0) {
            const coberturas = await this.insertCoberturas(subparcela.coberturas, idSubparcela);
            resultados.coberturas.push(...coberturas);
            }
    
            if (subparcela.afectaciones && subparcela.afectaciones.length > 0) {
            const alteraciones = await this.insertAlteraciones(subparcela.afectaciones, idSubparcela);
            resultados.alteraciones.push(...alteraciones);
            }
        }
    
        return resultados;
        } catch (error) {
        console.error('Error al sincronizar subparcelas:', error);
        throw error;
    }
};