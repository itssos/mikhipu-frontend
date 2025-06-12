from selenium import webdriver
from selenium.webdriver.edge.service import Service as EdgeService
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

EDGE_DRIVER_PATH = 'D:/UTP/CICLO9/INTEGRADOR II/proyecto/mikhipu-frontend/tests/msedgedriver.exe'
LOGIN_URL = "http://localhost:5173/auth/login"

def test_crear_curso():
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

        # 2. Ir a Cursos por el menú (no driver.get)
        cursos_menu = wait.until(
            EC.element_to_be_clickable((By.XPATH, '//a[@href="/admin/course"]'))
        )
        cursos_menu.click()

        # 3. Click en "Nuevo Curso"
        btn_nuevo_curso = wait.until(
            EC.element_to_be_clickable((By.XPATH, '//button[contains(text(),"Nuevo Curso")]'))
        )
        btn_nuevo_curso.click()

        # 4. Llenar el formulario del modal (adapta los XPATH si cambia)
        nombre = "Selenium Test " + str(int(time.time()))
        codigo = "selenium" + str(int(time.time()))
        anio = "2025"
        trimestre = "SEGUNDO"

        wait.until(EC.visibility_of_element_located((By.ID, 'courseCreate')))

        driver.find_element(By.NAME, "name").send_keys(nombre)
        driver.find_element(By.NAME, "code").send_keys(codigo)
        driver.find_element(By.NAME, "description").send_keys("Curso de prueba con Selenium")
        driver.find_element(By.NAME, "year").send_keys(anio)
        driver.find_element(By.NAME, "quarter").send_keys(trimestre)

        # Click en "Crear"
        btn_crear = driver.find_element(By.XPATH, '//button[contains(text(),"Guardar")]')
        btn_crear.click()

        # 5. Esperar que el curso aparezca en la tabla (por nombre)
        try:
            fila_curso = wait.until(
                EC.visibility_of_element_located((By.XPATH, f'//td[contains(text(),"{nombre}")]'))
            )
            print(f"✔️ Curso creado y visible en la tabla: '{nombre}'")
            prueba_exitosa = True
        except Exception:
            print(f"❌ No se encontró el curso recién creado en la tabla: '{nombre}'")

    except Exception as e:
        print(f"❌ Error durante la prueba: {e}")

    finally:
        driver.quit()
        if prueba_exitosa:
            print("✔️ Prueba de creación de curso finalizada correctamente.")
        else:
            print("❌ Prueba de creación de curso finalizada con errores.")

# if __name__ == "__main__":
#     test_crear_curso()
