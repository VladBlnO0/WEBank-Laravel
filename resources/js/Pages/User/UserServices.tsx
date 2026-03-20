import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { ServicePayment, ServiceProvider } from '@/types';
export default function UserServices({
  userData,
  services,
}: {
  userData: ServicePayment;
  services: ServiceProvider;
}) {
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl leading-tight font-semibold text-gray-800">
          Dashboard
        </h2>
      }
    >
      <Head title="Dashboard" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">You're logged in!</div>
          </div>
        </div>
      </div>

      <div className="d-flex overflow-hidden rounded bg-white p-2 shadow">
        <main className="grow p-4">
          {/* <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Підтвердження переказу</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>
                                Ви впевнені, що хочете оплатити <strong>{selected.length}</strong> послуги
                            </p>
                            <p>
                                Баланс після переказу: ${newBalance.toFixed(2)}
                            </p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Скасувати
                            </Button>
                            <Button variant="primary" onClick={confirmTransfer}>
                                Підтвердити
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <ToastContainer
                        className="p-3"
                        position={'middle-center'}
                        style={{ zIndex: 1 }}
                    >
                        <Toast onClose={() => setShowToast(false)}
                               show={showToast}
                               delay={3000}
                               autohide
                               style={{ backgroundColor: '#fff' }}>
                            <Toast.Header>
                                <strong className="me-auto">{ToastMsg.heading}</strong>
                            </Toast.Header>
                            <Toast.Body>
                                {ToastMsg.content}
                            </Toast.Body>
                        </Toast>
                    </ToastContainer> */}

          <div className="card mb-4 p-4">
            <table className="table">
              <thead>
                <tr className="table-light">
                  <th></th>
                  <th>Послуга</th>
                  <th>Провідник</th>
                  <th>Сума</th>
                  <th>Оплатити до</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => {
                  const payment = payments.find(
                    (p) => p.service_id === service.id,
                  );

                  let status = "В очікуванні";
                  let badgeClass = "bg-secondary";

                  if (payment) {
                    if (payment.status) {
                      status = "Оплачено";
                      badgeClass = "bg-success";
                    } else {
                      const due = new Date(payment.due_date);
                      const today = new Date();
                      if (due < today) {
                        status = "Прострочено";
                        badgeClass = "bg-danger";
                      } else {
                        status = "В очікуванні";
                        badgeClass = "bg-warning";
                      }
                    }
                  }
                  return (
                    <tr key={service.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selected.includes(service.id)}
                          onChange={() => toggleService(service.id)}
                          disabled={payment && payment.status}
                        />
                      </td>
                      <td>
                        <i className={`${service.icon} me-2`}></i>{" "}
                        {service.name}
                      </td>
                      <td>{service.provider}</td>
                      <td>${service ? service.tariff : "-"}</td>
                      <td>
                        {payment
                          ? new Date(payment.due_date).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        <span className={`badge ${badgeClass}`}>{status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="card p-4">
            <h5 className="mb-3">Підсумок платежу</h5>
            <div className="d-flex justify-content-between">
              <span>Вибрані послуги:</span>
              <span>{selected.length}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Загальна сума:</span>
              <span>${total}</span>
            </div>
            <div className="border-top my-3"></div>

            <button onClick={handleSubmit} className="btn btn-dark w-100">
              Оплатити <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </main>
      </div>
    </AuthenticatedLayout>
  );
}
