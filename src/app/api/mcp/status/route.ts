import { NextResponse } from "next/server"; export async function GET(){return NextResponse.json({ok:true,service:"mcp",timestamp:new Date().toISOString()});}
