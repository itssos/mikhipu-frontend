from selenium import webdriver
from selenium.webdriver.edge.service import Service as EdgeService
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

EDGE_DRIVER_PATH = 'D:/UTP/CICLO9/INTEGRADOR II/proyecto/mikhipu-frontend/tests/msedgedriver.exe'
LOGIN_URL = "http://localhost:5173/auth/login"

def test_crear_teacher():
    options = Options()
    service = EdgeService(executable_path=EDGE_DRIVER_PATH)
    driver = webdriver.Edge(service=service, options=options)
    wait = WebDriverWait(driver, 15)
    prueba_exitosa = False

    try:
        # 1. LOGIN (como siempre)
        driver.get(LOGIN_URL)
        usuario_input = wait.until(EC.presence_of_element_located((By.XPATH, '//input[@placeholder="Usuario"]')))
        contrasena_input = driver.find_element(By.XPATH, '//input[@placeholder="Contraseña"]')
        ingresar_btn = driver.find_element(By.XPATH, '//button[contains(text(), "Ingresar")]')
        usuario_input.send_keys("admin")
        contrasena_input.send_keys("1234")
        ingresar_btn.click()
        wait.until(EC.invisibility_of_element_located((By.XPATH, '//button[contains(text(), "Ingresar")]')))
        print("✔️ Login exitoso.")

        # 2. Menú docentes (¡haz click en el <a> o menú correspondiente!)
        docentes_menu = wait.until(
            EC.element_to_be_clickable((By.XPATH, '//a[@href="/admin/teacher"]'))
        )
        docentes_menu.click()
        print("✔️ Click en menú Docentes")

        # Espera a que cargue la pantalla de docentes (usa algo único de esa página)
        wait.until(EC.presence_of_element_located((By.CLASS_NAME, "test-id-add-person")))
        print("✔️ Pantalla docentes lista. URL:", driver.current_url)

        # 3. ABRIR el modal de crear docente
        add_teacher_btn = driver.find_element(By.CLASS_NAME, "test-id-add-person")
        add_teacher_btn.click()
        wait.until(EC.visibility_of_element_located((By.ID, "test-teacher-modal")))
        print("✔️ Modal crear docente visible.")

        # 4. COMPLETAR el formulario
        modal = driver.find_element(By.ID, "test-teacher-modal")
        inputs = modal.find_elements(By.TAG_NAME, "input")
        selects = modal.find_elements(By.TAG_NAME, "select")

        campos = [
            "DocentePrueba",    # Nombre
            "ApellidoPrueba",   # Apellido
            "44345478",         # DNI
            "1990-01-01",       # Fecha Nac.
            "Calle Falsa 123",  # Dirección
            "999888777",        # Teléfono
            "userdocente",      # Usuario
            "pass1234",         # Contraseña
            "docente@prueba.com",# Email
            "CODE123"           # Código Docente
        ]
        for input_, valor in zip(inputs, campos):
            input_.clear()
            input_.send_keys(valor)
        # Género y rol
        selects[0].send_keys("Masculino")
        selects[1].send_keys("DOCENTE")

        # 5. CREAR docente
        crear_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Crear')]")
        crear_btn.click()

        # 6. ESPERAR el Toast
        toast = wait.until(EC.visibility_of_element_located(
            (By.XPATH, "//div[contains(@class, 'Toastify__toast--success') and contains(., 'Docente creado')]")
        ))
        print("✔️ Docente creado exitosamente. Toast mostrado.")

    except Exception as e:
        print("❌ Error durante la prueba:", e)
    finally:
        time.sleep(2)
        driver.quit()

# if __name__ == "__main__":
#     test_crear_teacher()
