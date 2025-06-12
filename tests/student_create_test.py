from selenium import webdriver
from selenium.webdriver.edge.service import Service as EdgeService
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

EDGE_DRIVER_PATH = 'D:/UTP/CICLO9/INTEGRADOR II/proyecto/mikhipu-frontend/tests/msedgedriver.exe'
LOGIN_URL = "http://localhost:5173/auth/login"
ESTUDIANTES_URL = "http://localhost:5173/admin/student"

def test_login_y_crear_estudiante():
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

        # Espera a que desaparezca el botón de ingresar (login exitoso)
        wait.until(EC.invisibility_of_element_located((By.XPATH, '//button[contains(text(), "Ingresar")]')))
        print("✔️ Login exitoso.")

        # 2. Navegar a estudiantes SIN driver.get()
        # Opción 1: Click en el menú (más realista)
        estudiantes_menu = wait.until(
            EC.element_to_be_clickable((By.XPATH, '//a[@href="/admin/student"]'))
        )
        estudiantes_menu.click()

        # Opción 2: O usa JS para navegar (más rápido pero menos realista)
        # driver.execute_script('window.location.href = "/admin/student"')

        # 3. Crear estudiante (espera a que cargue la página)
        # --- 1. Abrir modal de "Crear Estudiante" usando la clase especial ---
        boton_modal = wait.until(
            EC.element_to_be_clickable((By.CLASS_NAME, 'test-id-add-person'))
        )
        boton_modal.click()

        nombre = "Prueba"
        apellido = "Selenium"
        dni = "99988877"
        fecha_nac = "2010-05-15"
        genero = "MASCULINO"
        direccion = "Calle Falsa 123"
        telefono = "999123456"
        usuario = f"selenium{dni}"
        contrasena = "Test1234*"
        rol = "ESTUDIANTE"
        email = f"selenium{dni}@correo.com"
        grado = "4"
        seccion = "B"
        nivel = "PRIMARIA"

        wait.until(EC.visibility_of_element_located((By.XPATH, '//h2[contains(text(), "Crear Estudiante")]')))

        driver.find_element(By.XPATH, '//label/span[text()="Nombre"]/../../input').send_keys(nombre)
        driver.find_element(By.XPATH, '//label/span[text()="Apellido"]/../../input').send_keys(apellido)
        driver.find_element(By.XPATH, '//label/span[text()="DNI"]/../../input').send_keys(dni)
        driver.find_element(By.XPATH, '//label/span[text()="Fecha Nac."]/../../input').send_keys(fecha_nac)
        driver.find_element(By.XPATH, '//label/span[text()="Género"]/../../select').send_keys(genero)
        driver.find_element(By.XPATH, '//label/span[text()="Dirección"]/../../input').send_keys(direccion)
        driver.find_element(By.XPATH, '//label/span[text()="Teléfono"]/../../input').send_keys(telefono)
        driver.find_element(By.XPATH, '//label/span[text()="Usuario"]/../../input').send_keys(usuario)
        driver.find_element(By.XPATH, '//label/span[text()="Contraseña"]/../../input').send_keys(contrasena)
        driver.find_element(By.XPATH, '//label/span[text()="Rol"]/../../select').send_keys(rol)
        driver.find_element(By.XPATH, '//label/span[text()="Email"]/../../input').send_keys(email)
        driver.find_element(By.XPATH, '//label/span[text()="Grado"]/../../input').send_keys(grado)
        driver.find_element(By.XPATH, '//label/span[text()="Sección"]/../../select').send_keys(seccion)
        driver.find_element(By.XPATH, '//label/span[text()="Nivel"]/../../select').send_keys(nivel)

        btn_crear = driver.find_element(By.XPATH, '//button[contains(text(),"Crear")]')
        btn_crear.click()

        time.sleep(2)  # Espera que la tabla se recargue

        # --- 4. Esperar Toast de éxito ---
        try:
            toast = wait.until(
                EC.visibility_of_element_located((By.XPATH, '//div[contains(@class,"Toastify__toast--success") and contains(text(),"Estudiante creado")]'))
            )
            print("✔️ Estudiante creado: Se mostró el Toast de éxito.")
            prueba_exitosa = True
        except Exception:
            print("❌ No apareció el Toast de éxito después de crear el estudiante.")

    except Exception as e:
        print(f"❌ Error durante la prueba: {e}")

    finally:
        driver.quit()
        if prueba_exitosa:
            print("✔️ Prueba de creación de estudiante finalizada correctamente.")
        else:
            print("❌ Prueba de creación de estudiante finalizada con errores.")

# if __name__ == "__main__":
#     test_login_y_crear_estudiante()
