import importlib

test_modules = [
    "course_create_test",
    "evaluation_create_test",
    "login_page_test",
    "student_create_test",
    "teacher_create_test"
]

passed = 0
failed = 0
details = []

for mod_name in test_modules:
    mod = importlib.import_module(mod_name)
    print(f"\n========== Ejecutando {mod_name} ==========")
    try:
        # Asume que tu función principal se llama test_<algo>
        for fn in dir(mod):
            if fn.startswith("test_"):
                func = getattr(mod, fn)
                func()
                print(f"✔️  {fn} PASÓ")
                passed += 1
    except Exception as e:
        print(f"❌  {mod_name} FALLÓ: {e}")
        failed += 1
        details.append((mod_name, str(e)))

total = passed + failed
print("\n================== RESUMEN ==================")
print(f"Total de pruebas: {total}")
print(f"Pasaron: {passed} ({round(passed*100/total,1)}%)")
print(f"Fallaron: {failed} ({round(failed*100/total,1)}%)")
if failed:
    print("\nDetalles de fallas:")
    for mod, err in details:
        print(f"  {mod}: {err}")
