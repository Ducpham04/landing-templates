package vn.leadhub.lead;

public enum LeadStatus {
  NEW("Mới"),
  CONTACTED("Đã liên hệ"),
  QUALIFIED("Tiềm năng"),
  WON("Đã chốt"),
  LOST("Thất bại");

  private final String label;

  LeadStatus(String label) {
    this.label = label;
  }

  public String label() {
    return label;
  }
}
