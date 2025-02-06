const ERROR = {
    // 🔥 ERROR 500 - ERRORES INTERNOS DEL SERVIDOR
    INTERNAL_SERVER: "Hubo un error interno en el Servidor",
    DATABASE_ERROR: "Error en la base de datos",
    QUERY_FAILED: "Fallo en la consulta a la base de datos",
    TRANSACTION_FAILED: "La transacción no se pudo completar",

    // 🚫 ERROR 404 - RECURSOS NO ENCONTRADOS
    NOT_FOUND: "Recurso no encontrado",
    NOT_FOUND_URL: "La URL solicitada no existe",
    NOT_FOUND_ID: "El ID proporcionado no fue encontrado",
    NOT_FOUND_DOCUMENT: "Documento no encontrado",
    NOT_FOUND_USER: "Usuario no encontrado",
    NOT_FOUND_EMAIL: "Email no encontrado",
    NOT_FOUND_PASSWORD: "Contraseña no encontrada",

    // 🛑 ERROR 403 - ACCESO DENEGADO / PERMISOS
    FORBIDDEN: "Acceso denegado",
    INSUFFICIENT_PERMISSIONS: "No tienes permisos para realizar esta operación",
    ROLE_NOT_ALLOWED: "Tu rol no tiene acceso a esta función",
    ACTION_NOT_ALLOWED: "No tienes permiso para realizar esta acción",
    APPROVAL_REQUIRED: "Tu solicitud requiere aprobación de un administrador",

    // 🔑 ERROR 401 - AUTENTICACIÓN
    UNAUTHORIZED: "No autorizado",
    TOKEN_MISSING: "Token de autenticación no proporcionado",
    TOKEN_INVALID: "Token inválido",
    TOKEN_EXPIRED: "Token expirado",
    SESSION_EXPIRED: "La sesión ha expirado, por favor inicia sesión nuevamente",
    
    // ❌ ERROR 400 - SOLICITUDES INVÁLIDAS / VALIDACIONES
    BAD_REQUEST: "Solicitud incorrecta",
    INVALID_REQUEST: "Los datos proporcionados son inválidos",
    MISSING_FIELDS: "Faltan campos obligatorios",
    INVALID_FORMAT: "Formato de datos inválido",
    INVALID_ID: "ID inválido",
    INVALID_EMAIL: "El formato del email es incorrecto",
    INVALID_PASSWORD: "La contraseña no cumple con los requisitos",
    PASSWORD_MISMATCH: "Las contraseñas no coinciden",
    USER_ALREADY_EXISTS: "El usuario ya está registrado",
    INVALID_CREDENTIALS: "Credenciales inválidas",
    INVALID_SCHEMA: "El esquema de datos proporcionado no es válido",
    FIELD_TOO_SHORT: "El valor del campo es demasiado corto",
    FIELD_TOO_LONG: "El valor del campo es demasiado largo",
    FIELD_REQUIRED: "Este campo es obligatorio",

    // ⛔ ERROR 409 - CONFLICTOS EN DATOS
    DUPLICATE_ENTRY: "El registro ya existe en la base de datos",
    EMAIL_ALREADY_REGISTERED: "Este email ya está registrado",
    USERNAME_ALREADY_TAKEN: "El nombre de usuario ya está en uso",
    DOCUMENT_ALREADY_EXISTS: "El documento ya existe",
    
    // ⚠️ ERROR 415 - TIPO DE ARCHIVO NO SOPORTADO
    UNSUPPORTED_MEDIA_TYPE: "El tipo de archivo no es compatible",
    INVALID_FILE_FORMAT: "El formato del archivo no es válido",
    
    // 🚦 ERROR 429 - DEMASIADAS SOLICITUDES
    TOO_MANY_REQUESTS: "Has realizado demasiadas solicitudes en poco tiempo. Inténtalo más tarde.",

    // 📝 ERRORES RELACIONADOS CON DOCUMENTOS / REPORTES
    DOCUMENT_CREATION_FAILED: "Error al crear el documento",
    DOCUMENT_UPDATE_FAILED: "Error al actualizar el documento",
    DOCUMENT_DELETION_FAILED: "Error al eliminar el documento",
    DOCUMENT_RETRIEVAL_FAILED: "Error al obtener el documento",
    REPORT_GENERATION_FAILED: "Error al generar el reporte",

    // 🔄 ERROR 503 - SERVICIO NO DISPONIBLE
    SERVICE_UNAVAILABLE: "El servicio no está disponible en este momento",
    DATABASE_UNAVAILABLE: "La base de datos no está disponible",
    
    // ⚠️ ERRORES PERSONALIZADOS SEGÚN TU APLICACIÓN
    BRANCH_NOT_FOUND: "Sucursal no encontrada",
    EMPLOYEE_NOT_FOUND: "Empleado no encontrado",
    SCHEDULE_CONFLICT: "Conflicto con el horario seleccionado",
    INVALID_DATE_RANGE: "El rango de fechas proporcionado no es válido",
    OPERATION_FAILED: "La operación no pudo completarse",
};

export default ERROR;
