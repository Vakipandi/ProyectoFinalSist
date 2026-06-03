-- ============================================================
-- SEED DATA: Catálogo de Servicios y Artículos KMS
-- Ejecutar en Supabase SQL Editor después del schema principal
-- ============================================================

-- CATÁLOGO DE SERVICIOS
INSERT INTO service_catalog (name, description, requirements, responsible, estimated_time, procedure, category, is_active) VALUES

('Acceso SAP',
 'Gestión de accesos al sistema SAP para consulta de información académica y administrativa.',
 'Carnet universitario vigente, código de alumno activo.',
 'Área de Sistemas',
 '1-2 días hábiles',
 '1. Realizar solicitud a través del portal o presencialmente. 2. El área de sistemas verifica el estado del usuario. 3. Se genera el acceso y se envían las credenciales al correo institucional.',
 'sistemas',
 true),

('Recuperación de Correo Institucional',
 'Recuperación de acceso al correo electrónico institucional (@usmp.pe o similar).',
 'DNI vigente, código de alumno activo.',
 'Área de Sistemas',
 '1 día hábil',
 '1. Presentar solicitud con datos de identificación. 2. Se verifica la identidad del solicitante. 3. Se restablece la contraseña y se envía al correo alternativo registrado.',
 'sistemas',
 true),

('Aula Virtual',
 'Soporte técnico para el acceso y uso del aula virtual de la universidad.',
 'Código de alumno activo, acceso a internet.',
 'Área de Sistemas',
 '1 día hábil',
 '1. Verificar que el alumno esté matriculado en el ciclo actual. 2. revisar que las credenciales sean correctas. 3. En caso de problemas, restablecer acceso desde el panel de administración.',
 'sistemas',
 true),

('Constancia de Estudios',
 'Emisión de constancia de studies para trámites personales, laborales o académicos.',
 'DNI vigente, código de alumno, no tener deudas pendientes.',
 'Registro Académico',
 '3-5 días hábiles',
 '1. Realizar solicitud online o en ventanilla. 2. Registro Académico verifica el estado del alumno. 3. Se emite el documento con firma y sello. 4. Retiro en ventanilla o envío por correo.',
 'academico',
 true),

('Retiro de Curso',
 'Gestión de retiro de un curso específico dentro del ciclo académico actual.',
 'Código de alumno, estar dentro del plazo establecido, no tener deudas.',
 'Registro Académico',
 '2-3 días hábiles',
 '1. Presentar solicitud de retiro especificando el curso. 2. Registro Académico valida el plazo y las condiciones. 3. Se procesa el retiro y se actualiza el historial académico. 4. Se notifica al alumno.',
 'academico',
 true),

('Retiro de Ciclo',
 'Gestión de retiro completo del ciclo académico vigente.',
 'Código de alumno, estar dentro del plazo establecido, justificación del retiro.',
 'Registro Académico',
 '3-5 días hábiles',
 '1. Presentar solicitud de retiro de ciclo con justificación. 2. Se evalúa la solicitud por el área académica. 3. Se procesa el retiro y se actualiza el historial. 4. Se notifica al alumno y se genera constancia.',
 'academico',
 true),

('Carnet Universitario',
 'Emisión o renovación del carnet universitario del estudiante.',
 'DNI vigente, foto reciente tamaño carnet, código de alumno activo.',
 'Bienestar Universitario',
 '5-7 días hábiles',
 '1. Presentar solicitud con documentos requeridos. 2. Se toma la foto o se entrega foto reciente. 3. Se genera el carnet en imprenta. 4. Retiro en ventanilla de Bienestar Universitario.',
 'tramites',
 true),

('Becas',
 'Información y gestión de solicitudes de becas académicas y sociales.',
 'DNI vigente, certificado de notas, documentos de sustento socioeconómico.',
 'Bienestar Universitario',
 '10-15 días hábiles',
 '1. Consultar convocatoria vigente. 2. Reunir documentación requerida. 3. Presentar solicitud dentro del plazo. 4. El comité evalúa la solicitud. 5. Se notifica el resultado al alumno.',
 'financiero',
 true),

('Matrícula',
 'Proceso de matrícula para el ciclo académico actual o próximo.',
 'Código de alumno activo, haber aprobado el ciclo anterior, no tener deudas.',
 'Registro Académico',
 '1-2 días hábiles (durante periodo de matrícula)',
 '1. Verificar disponibilidad de vacantes. 2. Seleccionar cursos a matricular. 3. Confirmar matrícula en el sistema. 4. Realizar pago de matrícula. 5. Confirmar inscripción.',
 'matricula',
 true),

('Reubicación',
 'Solicitud de reubicación de curso o grupo dentro del mismo ciclo.',
 'Código de alumno, justificación de la reubicación, cupo disponible en el grupo destino.',
 'Registro Académico',
 '2-4 días hábiles',
 '1. Presentar solicitud de reubicación con justificación. 2. Registro Académico verifica cupo disponible. 3. Se evalúa la viabilidad académica. 4. Se procesa el cambio y se notifica al alumno.',
 'academico',
 true);


-- ARTÍCULOS KMS (Base de Conocimientos)
INSERT INTO kms_articles (title, content, category, keywords, is_published, created_by, view_count) VALUES

-- SISTEMAS
('¿Cómo acceder a SAP?',
 'Para acceder a SAP, ingresa al portal universitario con tu código de alumno y contraseña. Si es tu primer ingreso, usa la contraseña temporal enviada a tu correo institucional. En caso de problemas, solicita recuperación de acceso al área de Sistemas.',
 'sistemas',
 ARRAY['sap', 'acceso', 'login', 'portal', 'credenciales'],
 true, NULL, 12),

('¿Cómo recuperar mi correo institucional?',
 'Ingresa a la plataforma de correo institucional y selecciona "Olvidé mi contraseña". Recibirás un enlace de recuperación en tu correo alternativo registrado. Si no tienes correo alternativo, acude al área de Sistemas con tu DNI.',
 'sistemas',
 ARRAY['correo', 'email', 'institucional', 'recuperar', 'contraseña'],
 true, NULL, 8),

('¿Cómo ingresar al aula virtual?',
 'Accede al aula virtual desde el portal universitario con tu código y contraseña. Las clases en línea se encuentran en la sección "Aula Virtual". Asegúrate de usar un navegador actualizado (Chrome o Firefox recomendados).',
 'sistemas',
 ARRAY['aula', 'virtual', 'clases', 'online', 'portal'],
 true, NULL, 15),

('Problemas comunes con el aula virtual',
 'Si el aula virtual no carga: 1) Verifica tu conexión a internet. 2) Limpia la caché del navegador. 3) Intenta con otro navegador. 4) Si persiste, contacta al área de Sistemas con captura del error.',
 'sistemas',
 ARRAY['aula', 'virtual', 'problema', 'error', 'soporte'],
 true, NULL, 6),

-- ACADÉMICO
('¿Cómo solicitar una constancia de estudios?',
 'Puedes solicitar tu constancia de estudios de dos maneras: 1) Online: Ingresa al portal, sección "Trámites", selecciona "Constancia de Estudios" y descarga el PDF. 2) Presencial: Acude a Registro Académico con tu DNI y código de alumno.',
 'academico',
 ARRAY['constancia', 'estudios', 'documento', 'tramite', 'certificado'],
 true, NULL, 20),

('¿Cómo solicitar el retiro de curso?',
 'El retiro de curso solo está disponible dentro del plazo establecido por la universidad (generalmente hasta la semana 6 del ciclo). Ingresa al portal, sección "Trámites Académicos", selecciona el curso y confirma el retiro. No se realizan retiros fuera de plazo.',
 'academico',
 ARRAY['retiro', 'curso', 'materia', 'baja', 'plazo'],
 true, NULL, 10),

('¿Cómo solicitar el retiro de ciclo?',
 'El retiro de ciclo requiere justificación y debe realizarse dentro del plazo establecido. Presenta solicitud en Registro Académico con los siguientes documentos: 1) Formulario de retiro. 2) Justificación (documento de soporte). 3) No tener deudas pendientes.',
 'academico',
 ARRAY['retiro', 'ciclo', 'semestre', 'baja', 'justificacion'],
 true, NULL, 7),

('¿Cómo consultar mis notas?',
 'Ingresa al portal universitario, sección "Historial Académico". Ahí podrás ver las notas de todos los ciclos cursados. Las notas se publican después de cada Evaluación Parcial y Final.',
 'academico',
 ARRAY['notas', 'calificaciones', 'historial', 'evaluacion', 'notas finales'],
 true, NULL, 18),

-- FINANCIERO
('¿Cómo consultar mi deuda pendiente?',
 'Ingresa al portal universitario, sección "Finanzas" o "Pagos". Ahí verás el detalle de deudas pendientes, fechas de vencimiento y opciones de pago. También puedes acudir a Finanzas con tu DNI para obtener un extracto.',
 'financiero',
 ARRAY['deuda', 'pago', 'finanzas', 'cuota', 'matricula'],
 true, NULL, 9),

('¿Cómo realizar el pago de matrícula?',
 'El pago de matrícula se realiza a través del portal universitario con tarjeta de crédito/débito o en bancos autorizados con el código de pago generado. Guarda el comprobante de pago para cualquier consulta.',
 'financiero',
 ARRAY['pago', 'matricula', 'tarjeta', 'banco', 'comprobante'],
 true, NULL, 11),

-- MATRÍCULA
('¿Cómo matricularme en los cursos del próximo ciclo?',
 'Durante el periodo de matrícula: 1) Ingresa al portal y selecciona "Matrícula". 2) Revisa los cursos disponibles y sus horarios. 3) Selecciona los cursos que deseas tomar. 4) Confirma la matrícula. 5) Realiza el pago dentro del plazo establecido.',
 'matricula',
 ARRAY['matricula', 'cursos', 'inscripcion', 'horarios', 'ciclo'],
 true, NULL, 14),

('¿Cuándo es el periodo de matrícula?',
 'El periodo de matrícula generalmente se abre 2 semanas antes del inicio del ciclo. Las fechas exactas se publican en el portal universitario y en los avisos oficiales. Revisa el calendario académico para las fechas específicas.',
 'matricula',
 ARRAY['matricula', 'fechas', 'plazo', 'calendario', 'periodo'],
 true, NULL, 5),

-- TRÁMITES
('¿Cómo obtener mi carnet universitario?',
 'Para obtener tu carnet: 1) Acude a Bienestar Universitario con tu DNI y una foto tamaño carnet reciente. 2) Llena el formulario de solicitud. 3) El carnet se genera en 5-7 días hábiles. 4) Retira tu carnet en la misma ventanilla mostrando tu DNI.',
 'tramites',
 ARRAY['carnet', 'identificacion', 'estudiante', 'foto', 'bienestar'],
 true, NULL, 6),

('¿Cómo solicitar una constancia de no deuda?',
 'Ingresa al portal, sección "Trámites", selecciona "Constancia de No Deuda". El documento se genera automáticamente si no tienes deudas pendientes. Si tienes deudas, deberás regularizar tu situación financiera primero.',
 'tramites',
 ARRAY['constancia', 'no deuda', 'finanzas', 'tramite', 'libre'],
 true, NULL, 4);
