import { Modal, Input, Button } from 'quizlec-front';

export function Default() {
  return (
    <Modal title="Create Lecture" onClose={() => {}}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input label="Title" placeholder="e.g. Introduction to Arrays" />
        <Input label="Duration (minutes)" placeholder="45" type="number" />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Create</Button>
        </div>
      </div>
    </Modal>
  );
}
