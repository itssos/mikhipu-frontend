from selenium import webdriver
from selenium.webdriver.edge.service import Service as EdgeService
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

EDGE_DRIVER_PATH = 'D:/UTP/CICLO9/INTEGRADOR II/proyecto/mikhipu-frontend/tests/msedgedriver.exe'
LOGIN_URL = "http://localhost:5173/auth/login"

def test_login_success():
    options = Options()
    service = EdgeService(executable_path=EDGE_DRIVER_PATH)
    driver = webdriver.Edge(service=service, options=options)
    prueba_exitosa = False

    try:
        driver.get(LOGIN_URL)
        wait = WebDriverWait(driver, 10)

        usuario_input = wait.until(EC.presence_of_element_located((By.XPATH, '//input[@placeholder="Usuario"]')))
        contrasena_input = driver.find_element(By.XPATH, '//input[@placeholder="Contraseña"]')
        ingresar_btn = driver.find_element(By.XPATH, '//button[contains(text(), "Ingresar")]')

        # Ingresa credenciales válidas
        usuario_input.send_keys("admin")
        contrasena_input.send_keys("1234")
        ingresar_btn.click()

        # Espera un cambio en la página: desaparece el botón de ingresar o aparece algo que indica éxito
        try:
            # Espera a que desaparezca el botón de ingresar (login exitoso suele cambiar la vista)
            wait.until(EC.invisibility_of_element_located((By.XPATH, '//button[contains(text(), "Ingresar")]')))
            # Además, aseguramos que NO aparece mensaje de error
            error_visible = False
            try:
                driver.find_element(By.XPATH, '//p[contains(text(), "Error de autenticación: Bad credentials")]')
                error_visible = True
            except:
                pass

            if not error_visible:
                print("✔️ Login exitoso: Cambió de vista y NO apareció mensaje de error.")
                prueba_exitosa = True
            else:
                print("❌ Login fallido: Apareció mensaje de error incluso con credenciales válidas.")
        except Exception:
            print("❌ Login fallido: No cambió de vista tras ingresar credenciales válidas.")
    except Exception as e:
        print(f"❌ Error durante la prueba de login exitoso: {e}")
    finally:
        driver.quit()
        if not prueba_exitosa:
            print("❌ Prueba de login exitoso finalizada con errores.")
        else:
            print("✔️ Prueba de login exitoso finalizada correctamente.")

def test_login_error_message_for_invalid_credentials():
    options = Options()
    service = EdgeService(executable_path=EDGE_DRIVER_PATH)
    driver = webdriver.Edge(service=service, options=options)
    prueba_exitosa = False

    try:
        driver.get(LOGIN_URL)
        wait = WebDriverWait(driver, 10)

        usuario_input = wait.until(EC.presence_of_element_located((By.XPATH, '//input[@placeholder="Usuario"]')))
        contrasena_input = driver.find_element(By.XPATH, '//input[@placeholder="Contraseña"]')
        ingresar_btn = driver.find_element(By.XPATH, '//button[contains(text(), "Ingresar")]')

        # Ingresa credenciales inválidas
        usuario_input.send_keys("usuario_incorrecto")
        contrasena_input.send_keys("contraseña_incorrecta")
        ingresar_btn.click()

        # Espera que aparezca el mensaje de error
        try:
            error_msg = wait.until(
                EC.visibility_of_element_located(
                    (By.XPATH, '//p[contains(text(), "Error de autenticación: Bad credentials")]')
                )
            )
            print("✔️ Mensaje de error visible correctamente:", error_msg.text)
            prueba_exitosa = True
        except Exception:
            print("❌ No apareció el mensaje de error tras ingresar credenciales inválidas.")

    except Exception as e:
        print(f"❌ Error durante la prueba de login inválido: {e}")
    finally:
        driver.quit()
        if not prueba_exitosa:
            print("❌ Prueba de login inválido finalizada con errores.")
        else:
            print("✔️ Prueba de login inválido finalizada correctamente.")

# if __name__ == "__main__":
#     print("\n========== Ejecutando test: LOGIN EXITOSO ==========")
#     test_login_success()
#     print("\n========== Ejecutando test: LOGIN INVÁLIDO ==========")
#     test_login_error_message_for_invalid_credentials()
