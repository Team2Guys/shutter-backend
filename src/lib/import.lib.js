import { validate } from "./validation.lib.js";

/**
 * Generic CSV bulk-import engine, shared by every module's `importMany`.
 *
 * Each row is upserted independently and errors are collected per-row so one
 * bad row never aborts the whole batch. Images are never imported — callers
 * only list scalar/text fields in `fields`.
 *
 * @param {object}   cfg
 * @param {object[]} cfg.rows        Parsed rows (may each carry an `id`).
 * @param {string}   cfg.editor      Recorded in `lastEditedBy`.
 * @param {boolean}  cfg.canCreate   Whether unmatched rows may be created.
 * @param {string[]} cfg.fields      Field names copied from the row when non-empty.
 * @param {(row:object, clean:object) => Promise<object|null>} cfg.findExisting
 *        Resolve the existing record a row targets (id/path/name lookups).
 * @param {(clean:object, row:object, existing:object|null) => Promise<object>} [cfg.normalize]
 *        Optional async coercion before validation (relations, ints, JSON…).
 * @param {object}   cfg.createSchema Zod schema for new records.
 * @param {object}   cfg.updateSchema Zod schema for updates.
 * @param {(data:object, editor:string) => Promise<any>} cfg.create Persist a new record.
 * @param {(id:string, data:object, editor:string) => Promise<any>} cfg.update Persist changes.
 * @param {(row:object) => string} cfg.label Human label used in error messages.
 * @returns {Promise<{created:number, updated:number, skipped:number, errors:string[]}>}
 */
export const runImport = async ({
  rows,
  editor,
  canCreate,
  fields,
  findExisting,
  normalize,
  createSchema,
  updateSchema,
  create,
  update,
  label,
}) => {
  const result = { created: 0, updated: 0, skipped: 0, errors: [] };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const line = i + 2; // account for the CSV header row

    try {
      // Keep only importable, non-empty fields (blank cells must not wipe data).
      const clean = {};
      for (const key of fields) {
        const value = row[key];
        if (value === undefined || value === null) continue;
        const trimmed = typeof value === "string" ? value.trim() : value;
        if (trimmed !== "") clean[key] = trimmed;
      }

      const existing = await findExisting(row, clean);
      const prepared = normalize ? await normalize(clean, row, existing) : clean;

      if (existing) {
        const data = validate(updateSchema, prepared);
        await update(existing.id, data, editor);
        result.updated += 1;
      } else {
        if (!canCreate) {
          throw new Error(
            "no matching record found; creating new records requires the Add permission",
          );
        }
        const data = validate(createSchema, prepared);
        await create(data, editor);
        result.created += 1;
      }
    } catch (err) {
      result.skipped += 1;
      result.errors.push(`Row ${line} (${label(row)}): ${err.message}`);
    }
  }

  return result;
};
