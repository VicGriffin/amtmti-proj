type InsertRow = Record<string, unknown>

function getMissingColumnName(error: any) {
  const message = String(error?.message || '')

  const schemaCacheMatch = message.match(
    /Could not find the '([^']+)' column of '([^']+)' in the schema cache/i,
  )
  if (schemaCacheMatch?.[1]) {
    return schemaCacheMatch[1]
  }

  const relationMatch = message.match(
    /column "([^"]+)" of relation "([^"]+)" does not exist/i,
  )
  if (relationMatch?.[1]) {
    return relationMatch[1]
  }

  return null
}

export async function insertWithColumnFallback(
  supabase: any,
  table: string,
  row: InsertRow,
  maxAttempts = 12,
) {
  const payload: InsertRow = { ...row }
  const removedColumns = new Set<string>()

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const { error } = await supabase.from(table).insert([payload])

    if (!error) {
      return { error: null, removedColumns: [...removedColumns] }
    }

    const missingColumn = getMissingColumnName(error)
    if (!missingColumn || removedColumns.has(missingColumn)) {
      return { error, removedColumns: [...removedColumns] }
    }

    delete payload[missingColumn]
    removedColumns.add(missingColumn)
    console.warn(
      `Retrying ${table} insert without unsupported column "${missingColumn}"`,
    )
  }

  return {
    error: new Error(`Unable to insert row into ${table}`),
    removedColumns: [...removedColumns],
  }
}
