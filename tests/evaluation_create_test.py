from selenium import webdriver
from selenium.webdriver.edge.service import Service as EdgeService
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.options import Options
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
import time

EDGE_DRIVER_PATH = 'D:/UTP/CICLO9/INTEGRADOR II/proyecto/mikhipu-frontend/tests/msedgedriver.exe'
LOGIN_URL = "http://localhost:5173/auth/login"

def test_crear_evaluacion():
    options = Options()
    service = EdgeService(executable_path=EDGE_DRIVER_PATH)
    driver = webdriver.Edge(service=service, options=options)
    wait = WebDriverWait(driver, 10)
    prueba_exitosa = False

    try:
        # 1. LOGIN
        driver.get(LOGIN_URL)
        usuario_input = wait.until(EC.presence_of_element_located((By.XPATH, '//input[@placeholder="Usuario"]')))
        contrasena_input = driver.find_element(By.XPATH, '//input[@placeholder="Contraseña"]')
        ingresar_btn = driver.find_element(By.XPATH, '//button[contains(text(), "Ingresar")]')
        usuario_input.send_keys("admin")
        contrasena_input.send_keys("1234")
        ingresar_btn.click()
        wait.until(EC.invisibility_of_element_located((By.XPATH, '//button[contains(text(), "Ingresar")]')))
        print("✔️ Login exitoso.")

        # 2. Ir a Cursos por el menú
        cursos_menu = wait.until(
            EC.element_to_be_clickable((By.XPATH, '//a[@href="/admin/course"]'))
        )
        cursos_menu.click()
        print("✔️ Navegaste a Cursos.")

        # 3. Click en botón "Evaluaciones"
        btn_evaluaciones = wait.until(
            EC.element_to_be_clickable((By.XPATH, '//button[contains(text(),"Evaluaciones")]'))
        )
        btn_evaluaciones.click()
        print("✔️ Click en botón Evaluaciones.")

        # 4. Click en "Nueva evaluación"
        btn_nueva_eval = wait.until(
            EC.element_to_be_clickable((By.XPATH, '//button[contains(text(),"Nueva evaluación")]'))
        )
        btn_nueva_eval.click()
        print("✔️ Click en Nueva evaluación.")

        # 5. Esperar el modal y el primer campo del formulario realmente listos
        wait.until(EC.visibility_of_element_located((By.XPATH, '//h2[text()="Nueva Evaluación"]')))
        wait.until(EC.visibility_of_element_located((By.NAME, "courseId")))
        wait.until(EC.element_to_be_clickable((By.NAME, "courseId")))
        print("✔️ Modal de nueva evaluación visible.")

        # 6. Llenar el formulario con waits en cada campo
        # Select de curso
        wait.until(EC.visibility_of_element_located(
            (By.CLASS_NAME, 'test-course-evaluation-create')
        )).send_keys("MATEMATICA")

        wait.until(EC.element_to_be_clickable((By.NAME, "name"))).send_keys("Eval Selenium " + str(int(time.time())))
        wait.until(EC.visibility_of_element_located(
            (By.CLASS_NAME, 'test-type-evaluation-create')
        )).send_keys("EXAM")
        wait.until(EC.element_to_be_clickable((By.NAME, "weight"))).send_keys("30")
        wait.until(EC.element_to_be_clickable((By.NAME, "date"))).send_keys("01-07-2025")
        wait.until(EC.element_to_be_clickable((By.NAME, "minScore"))).send_keys("0")
        wait.until(EC.element_to_be_clickable((By.NAME, "maxScore"))).send_keys("20")

        # 7. Click en Guardar (espera a que esté clickable)
        btn_guardar = wait.until(
            EC.element_to_be_clickable((By.XPATH, '//button[contains(text(),"Guardar")]'))
        )
        btn_guardar.click()
        print("✔️ Click en Guardar evaluación.")

        # 8. Esperar Toast de éxito
        toast = wait.until(
            EC.visibility_of_element_located(
                (By.XPATH, "//div[contains(@class, 'Toastify__toast--success') and contains(., 'Evaluación creada')]")
            )
        )
        print("✔️ Evaluación creada exitosamente. Toast mostrado.")
        prueba_exitosa = True

    except Exception as e:
        print(f"❌ Error durante la prueba: {e}")

    finally:
        driver.quit()
        if prueba_exitosa:
            print("✔️ Prueba de creación de evaluación finalizada correctamente.")
        else:
            print("❌ Prueba de creación de evaluación finalizada con errores.")

# if __name__ == "__main__":
#     test_crear_evaluacion()
