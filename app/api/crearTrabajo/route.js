// app/api/crearTrabajo/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("CRITICAL ERROR: Supabase URL or Service Role Key is not defined in environment variables. API will not function.");
}

const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(request) {
  if (!supabase) {
    console.error("Error en POST /api/crearTrabajo: Cliente Supabase no inicializado. Verifica las variables de entorno.");
    return NextResponse.json({ error: 'Configuración del servidor incompleta o inválida.' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { creado_por, descripcion, precio, zona, latitud, longitud } = body;

    if (!creado_por || !descripcion || typeof precio === 'undefined') {
      return NextResponse.json({ error: 'Faltan campos requeridos: creado_por, descripcion, precio' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('trabajos')
      .insert([
        { 
          creado_por, 
          descripcion, 
          precio, 
          zona, 
          estado: 'pendiente',
          latitud, 
          longitud,
        }
      ])
      .select()
      .single(); 

    if (error) {
      console.error('Error de Supabase al insertar trabajo:', error);
      return NextResponse.json({ error: 'Error al interactuar con la base de datos.', details: error.message }, { status: 500 }); 
    }

    return NextResponse.json({ trabajo: data }, { status: 201 });

  } catch (e) {
    console.error('Error en el handler de crearTrabajo:', e);
    let errorMessage = 'Error interno del servidor.';
    let statusCode = 500;
    if (e instanceof SyntaxError) { 
        errorMessage = 'El cuerpo de la solicitud no es un JSON válido.';
        statusCode = 400;
    }
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
